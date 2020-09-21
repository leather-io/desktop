import React, { FC, useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BN from 'bn.js';
import { BigNumber } from 'bignumber.js';
import { Modal, Text, Button, Box } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import {
  makeSTXTokenTransfer,
  MEMO_MAX_LENGTH_BYTES,
  makeUnsignedSTXTokenTransfer,
  StacksTransaction,
} from '@blockstack/stacks-transactions';
import BlockstackApp, { LedgerError } from '@zondax/ledger-blockstack';
import { useHotkeys } from 'react-hotkeys-hook';

import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import { validateStacksAddress } from '@utils/get-stx-transfer-direction';

import { homeActions } from '@store/home/home.reducer';
import {
  selectEncryptedMnemonic,
  selectSalt,
  decryptSoftwareWallet,
  selectWalletType,
} from '@store/keys';
import { validateAddressChain } from '../../crypto/validate-address-net';
import { broadcastStxTransaction } from '@store/transaction';
import { toHumanReadableStx, stxToMicroStx, microStxToStx } from '@utils/unit-convert';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { stacksNetwork } from '../../environment';
import {
  TxModalHeader,
  buttonStyle,
  TxModalFooter,
  TxModalPreview,
  TxModalPreviewItem,
  modalStyle,
} from './transaction-modal-layout';
import { TxModalForm } from './transaction-form';
import { DecryptWalletForm } from './decrypt-wallet-form';
import { SignTxWithLedger } from './sign-tx-with-ledger';
import { selectPublicKey } from '@store/keys/keys.reducer';
import { FailedBroadcastError } from './failed-broadcast-error';

import { LedgerConnectStep } from '@hooks/use-ledger';
import { createMessageSignature } from '@blockstack/stacks-transactions/lib/authorization';

interface TxModalProps {
  balance: string;
  address: string;
}

enum TxModalStep {
  DescribeTx,
  PreviewTx,
  DecryptWalletAndSend,
  SignWithLedgerAndSend,
  NetworkError,
}

type ModalComponents = () => Record<'header' | 'body' | 'footer', JSX.Element>;

export const TransactionModal: FC<TxModalProps> = ({ balance, address }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  useHotkeys('esc', () => void dispatch(homeActions.closeTxModal()));
  const [step, setStep] = useState(TxModalStep.DescribeTx);
  const [fee, setFee] = useState(new BN(0));
  const [amount, setAmount] = useState(new BigNumber(0));
  const [password, setPassword] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [total, setTotal] = useState(new BigNumber(0));
  const [decryptionError, setDecryptionError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [loading, setLoading] = useState(false);
  const interactedWithSendAllBtn = useRef(false);

  const { encryptedMnemonic, salt, walletType, publicKey } = useSelector((state: RootState) => ({
    salt: selectSalt(state),
    encryptedMnemonic: selectEncryptedMnemonic(state),
    walletType: selectWalletType(state),
    publicKey: selectPublicKey(state),
  }));

  const [blockstackApp, setBlockstackApp] = useState<null | BlockstackApp>(null);

  const broadcastTx = async (blockstackApp?: BlockstackApp) => {
    setHasSubmitted(true);

    let tx: StacksTransaction | null = null;

    const txDetails = {
      recipient: form.values.recipient,
      network: stacksNetwork,
      amount: new BN(stxToMicroStx(form.values.amount).toString()),
      memo: form.values.memo,
    };

    if (walletType === 'software') {
      if (!password || !encryptedMnemonic || !salt) return;
      setIsDecrypting(true);
      try {
        const { privateKey } = await decryptSoftwareWallet({
          ciphertextMnemonic: encryptedMnemonic,
          salt,
          password,
        });

        tx = await makeSTXTokenTransfer({ ...txDetails, senderKey: privateKey });
      } catch (e) {
        setDecryptionError(e);
        setIsDecrypting(false);
        return;
      }
    }

    if (walletType === 'ledger') {
      try {
        if (!publicKey || !blockstackApp) return;

        tx = await makeUnsignedSTXTokenTransfer({
          ...txDetails,
          publicKey: publicKey.toString('hex'),
        });

        const resp = await blockstackApp.sign(`m/44'/5757'/0'/0/0`, tx.serialize());

        if (resp.returnCode !== LedgerError.NoErrors) {
          setHasSubmitted(false);
          return;
        }

        if (tx.auth.spendingCondition) {
          (tx.auth.spendingCondition as any).signature = createMessageSignature(
            resp.signatureVRS.toString('hex')
          );
        }
      } catch (e) {
        setHasSubmitted(false);
        return;
      }
    }

    if (tx === null) return;

    dispatch(
      broadcastStxTransaction({
        signedTx: tx,
        amount,
        onBroadcastSuccess: closeModalResetForm,
        onBroadcastFail: () => setStep(TxModalStep.NetworkError),
      })
    );

    setIsDecrypting(false);
  };

  const totalIsMoreThanBalance = total.isGreaterThan(balance);

  const exceedsMaxLengthBytes = (string: string, maxLengthBytes: number): boolean =>
    string ? Buffer.from(string).length > maxLengthBytes : false;

  const form = useFormik({
    validateOnChange: true,
    validateOnMount: !interactedWithSendAllBtn.current,
    validateOnBlur: !interactedWithSendAllBtn.current,
    initialValues: {
      recipient: '',
      amount: '',
      memo: '',
    },
    validationSchema: yup.object().shape({
      recipient: yup
        .string()
        .test('test-is-stx-address', 'Must be a valid Stacks Address', (value = '') =>
          value === null ? false : validateStacksAddress(value)
        )
        .test('test-is-for-valid-chain', 'Address is for incorrect network', (value = '') =>
          value === null ? false : validateAddressChain(value)
        )
        .test(
          'test-is-not-my-address',
          'You cannot send Stacks to yourself',
          value => value !== address
        ),
      amount: yup
        .number()
        .typeError('Amount of STX must be described as number')
        .positive('You cannot send a negative amount of STX')
        .test(
          'test-has-less-than-or-equal-to-6-decimal-places',
          'STX do not have more than 6 decimal places',
          value => {
            if (value === null || value === undefined) return false;
            // Explicit base ensures BigNumber doesn't use exponential notation
            const decimals = new BigNumber(value).toString(10).split('.')[1];
            return decimals === undefined || decimals.length <= 6;
          }
        )
        .test(
          'test-address-has-enough-balance',
          'Cannot send more STX than available balance',
          value => {
            if (value === null || value === undefined) return false;
            // If there's no input, pass this test,
            // otherwise it'll render the error for this test
            if (value === undefined) return true;
            const enteredAmount = stxToMicroStx(value);
            // console.log(enteredAmount.toString());
            // console.log(balance.toString());
            return enteredAmount.isLessThanOrEqualTo(balance);
          }
        )
        .required(),
      memo: yup
        .string()
        .test('test-max-memo-length', 'Transaction memo cannot exceed 34 bytes', (value = '') =>
          value === null ? false : !exceedsMaxLengthBytes(value, MEMO_MAX_LENGTH_BYTES)
        ),
    }),
    onSubmit: async () => {
      setLoading(true);
      setDecryptionError(null);
      const demoTx = await makeSTXTokenTransfer({
        recipient: form.values.recipient,
        network: stacksNetwork,
        amount: new BN(stxToMicroStx(form.values.amount).toString()),
        //
        // SECURITY: find common burn address
        senderKey: 'f0bc18b8c5adc39c26e0fe686c71c7ab3cc1755a3a19e6e1eb84b55f2ede95da01',
      });
      const { amount, fee } = {
        amount: stxToMicroStx(form.values.amount),
        fee: demoTx.auth.spendingCondition?.fee as BN,
      };
      setFee(fee);
      setTotal(amount.plus(fee.toString()));
      setAmount(amount);
      setStep(TxModalStep.PreviewTx);
      setLoading(false);
    },
  });

  const [calculatingMaxSpend, setCalculatingMaxSpend] = useState(false);
  const [ledgerConnectStep, setLedgerConnectStep] = useState(LedgerConnectStep.Disconnected);

  const closeModalResetForm = () => dispatch(homeActions.closeTxModal());

  const proceedToSignTransactionStep = () =>
    walletType === 'software'
      ? setStep(TxModalStep.DecryptWalletAndSend)
      : setStep(TxModalStep.SignWithLedgerAndSend);

  const updateAmountFieldToMaxBalance = async () => {
    interactedWithSendAllBtn.current = true;
    setCalculatingMaxSpend(true);
    const demoTx = await makeSTXTokenTransfer({
      // SECURITY: remove hardcoded test address
      recipient: form.values.recipient || 'ST3NR0TBES0A94R38EJ8TC1TGWPN9T1SHVW03ZBD7',
      network: stacksNetwork,
      amount: new BN(stxToMicroStx(form.values.amount).toString()),
      // SECURITY: find common burn address
      senderKey: 'f0bc18b8c5adc39c26e0fe686c71c7ab3cc1755a3a19e6e1eb84b55f2ede95da01',
    });
    const fee = demoTx.auth.spendingCondition?.fee as BN;
    const balanceLessFee = new BigNumber(balance).minus(fee.toString());
    if (balanceLessFee.isLessThanOrEqualTo(0)) {
      form.setFieldTouched('amount');
      form.setFieldError('amount', 'Your balance is not sufficient to cover the transaction fee');
      setCalculatingMaxSpend(false);
      return;
    }
    form.setValues({
      ...form.values,
      amount: microStxToStx(balanceLessFee.toString()).toString(),
    });
    setCalculatingMaxSpend(false);
    setTimeout(() => (interactedWithSendAllBtn.current = false), 1000);
  };

  const setBlockstackAppCallback = useCallback(
    blockstackApp => setBlockstackApp(blockstackApp),
    []
  );
  const updateStep = useCallback(step => setLedgerConnectStep(step), []);

  const txFormStepMap: Record<TxModalStep, ModalComponents> = {
    [TxModalStep.DescribeTx]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Send STX</TxModalHeader>,
      body: (
        <>
          <TxModalForm
            balance={balance}
            form={form}
            isCalculatingMaxSpend={calculatingMaxSpend}
            onSendEntireBalance={updateAmountFieldToMaxBalance}
          />
        </>
      ),
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={closeModalResetForm} {...buttonStyle}>
            Cancel
          </Button>
          <Button
            ml="base-tight"
            onClick={() => form.submitForm()}
            isLoading={loading}
            {...buttonStyle}
          >
            Preview
          </Button>
        </TxModalFooter>
      ),
    }),
    [TxModalStep.PreviewTx]: () => ({
      header: (
        <TxModalHeader onSelectClose={closeModalResetForm}>Preview transaction</TxModalHeader>
      ),
      body: (
        <TxModalPreview>
          <TxModalPreviewItem label="To">
            <Text fontSize="13px">{form.values.recipient}</Text>
          </TxModalPreviewItem>
          <TxModalPreviewItem label="Amount">
            {toHumanReadableStx(amount.toString())}
          </TxModalPreviewItem>
          <TxModalPreviewItem label="Fee">{toHumanReadableStx(fee)}</TxModalPreviewItem>
          <TxModalPreviewItem label="Total">
            {toHumanReadableStx(total.toString())}
          </TxModalPreviewItem>
          {form.values.memo && (
            <TxModalPreviewItem label="Memo">{form.values.memo}</TxModalPreviewItem>
          )}
          <Box minHeight="24px">
            {totalIsMoreThanBalance && (
              <ErrorLabel size="md" my="base-loose">
                <ErrorText fontSize="14px" lineHeight="20px">
                  You have insufficient balance to complete this transfer.
                </ErrorText>
              </ErrorLabel>
            )}
          </Box>
        </TxModalPreview>
      ),
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={() => setStep(TxModalStep.DescribeTx)} {...buttonStyle}>
            Go back
          </Button>
          <Button
            ml="base-tight"
            {...buttonStyle}
            isLoading={loading}
            isDisabled={totalIsMoreThanBalance}
            onClick={proceedToSignTransactionStep}
          >
            Sign transaction and send
          </Button>
        </TxModalFooter>
      ),
    }),
    [TxModalStep.DecryptWalletAndSend]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Confirm and send</TxModalHeader>,
      body: (
        <>
          <DecryptWalletForm
            onSetPassword={password => setPassword(password)}
            onForgottenPassword={() => {
              closeModalResetForm();
              history.push(routes.SETTINGS);
            }}
            hasSubmitted={hasSubmitted}
            decryptionError={decryptionError}
          />
        </>
      ),
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={() => setStep(TxModalStep.PreviewTx)} {...buttonStyle}>
            Go back
          </Button>
          <Button
            ml="base-tight"
            isLoading={isDecrypting}
            isDisabled={isDecrypting}
            onClick={() => broadcastTx()}
            {...buttonStyle}
          >
            Send transaction
          </Button>
        </TxModalFooter>
      ),
    }),
    [TxModalStep.SignWithLedgerAndSend]: () => ({
      header: (
        <TxModalHeader onSelectClose={closeModalResetForm}>Confirm on your Ledger</TxModalHeader>
      ),
      body: <SignTxWithLedger onLedgerConnect={setBlockstackAppCallback} updateStep={updateStep} />,
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={() => setStep(TxModalStep.PreviewTx)} {...buttonStyle}>
            Go back
          </Button>
          <Button
            ml="base-tight"
            isDisabled={
              blockstackApp === null ||
              hasSubmitted ||
              ledgerConnectStep !== LedgerConnectStep.ConnectedAppOpen
            }
            isLoading={hasSubmitted}
            onClick={() => {
              if (blockstackApp === null) return;
              void broadcastTx(blockstackApp);
            }}
            {...buttonStyle}
          >
            Sign transaction
          </Button>
        </TxModalFooter>
      ),
    }),
    [TxModalStep.NetworkError]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm} />,
      body: <FailedBroadcastError />,
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={closeModalResetForm}>
            Close
          </Button>
          <Button ml="base-tight" onClick={() => setStep(TxModalStep.DescribeTx)} {...buttonStyle}>
            Try again
          </Button>
        </TxModalFooter>
      ),
    }),
  };

  const { header, body, footer } = txFormStepMap[step]();

  return (
    <Modal isOpen headerComponent={header} footerComponent={footer} {...modalStyle}>
      {body}
    </Modal>
  );
};
