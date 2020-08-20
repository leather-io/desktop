import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BN from 'bn.js';
import { BigNumber } from 'bignumber.js';
import { Modal, Text, Button, Box } from '@blockstack/ui';
import {
  makeSTXTokenTransfer,
  pubKeyfromPrivKey,
  MEMO_MAX_LENGTH_BYTES,
} from '@blockstack/stacks-transactions';
import { useHotkeys } from 'react-hotkeys-hook';

import { RootState } from '../../store';
import routes from '../../constants/routes.json';
import { validateStacksAddress } from '../../utils/get-stx-transfer-direction';
import { MessageSignature } from '@blockstack/stacks-transactions/lib/authorization';
import { selectTxModalOpen, homeActions } from '../../store/home/home.reducer';
import {
  selectEncryptedMnemonic,
  selectSalt,
  decryptSoftwareWallet,
  selectWalletType,
} from '../../store/keys';
import { validateAddressChain } from '../../crypto/validate-address-net';
import { broadcastStxTransaction, selectMostRecentlyTxError } from '../../store/transaction';
import { toHumanReadableStx, stxToMicroStx } from '../../utils/unit-convert';
import { ErrorLabel } from '../../components/error-label';
import { ErrorText } from '../../components/error-text';
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
import BlockstackApp from '../../../../ledger-blockstack/js/src/index';
import { selectPublicKey } from '../../store/keys/keys.reducer';
import { useHistory } from 'react-router-dom';

interface TxModalProps {
  balance: string;
  address: string;
}

enum TxModalStep {
  DescribeTx,
  PreviewTx,
  DecryptWalletAndSend,
  SignWithLedgerAndSend,
}

type ModalComponents = () => {
  [component in 'header' | 'body' | 'footer']: JSX.Element;
};

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
  const {
    txModalOpen,
    encryptedMnemonic,
    salt,
    walletType,
    publicKey,
    broadcastError,
  } = useSelector((state: RootState) => ({
    txModalOpen: selectTxModalOpen(state),
    salt: selectSalt(state),
    encryptedMnemonic: selectEncryptedMnemonic(state),
    broadcastError: selectMostRecentlyTxError(state),
    walletType: selectWalletType(state),
    publicKey: selectPublicKey(state),
  }));

  const broadcastTx = async (blockstackApp?: BlockstackApp) => {
    console.log('broadcasting');
    setHasSubmitted(true);

    if (walletType === 'software') {
      if (!password || !encryptedMnemonic || !salt) return;
      setIsDecrypting(true);
      try {
        const { privateKey } = await decryptSoftwareWallet({
          ciphertextMnemonic: encryptedMnemonic,
          salt,
          password,
        });

        const tx = await makeSTXTokenTransfer({
          recipient: form.values.recipient,
          network: stacksNetwork,
          amount: new BN(stxToMicroStx(form.values.amount).toString()),
          senderKey: privateKey,
        });
        dispatch(
          broadcastStxTransaction({ signedTx: tx, amount, onBroadcastSuccess: closeModalResetForm })
        );
      } catch (e) {
        console.log(e);
        setDecryptionError(e);
      }
    }

    if (walletType === 'ledger') {
      try {
        if (!publicKey || !blockstackApp) {
          console.log('no public key saved??');
          return;
        }

        const demoTx = await makeSTXTokenTransfer({
          recipient: form.values.recipient,
          network: stacksNetwork,
          amount: new BN(stxToMicroStx(form.values.amount).toString()),
          senderKey: '5db4f7bb20960c6b1ceaa599576c3f01ec96448dc33d7894cc187b941f15cd3201',
        });

        console.log('signed with pk', demoTx.serialize().toString('hex'));

        const generatedPubkey = pubKeyfromPrivKey(
          '5db4f7bb20960c6b1ceaa599576c3f01ec96448dc33d7894cc187b941f15cd3201'
        );
        console.log({ generatedPubkey: generatedPubkey.data.toString('hex') });

        console.log({ persistedPubkey: publicKey.toString('hex') });

        console.log({ demoTx });

        const tx = await makeUnsignedSTXTokenTransfer({
          recipient: form.values.recipient,
          network: stacksNetwork,
          amount: new BN(stxToMicroStx(form.values.amount).toString()),
          publicKey,
        });

        console.log({ unsignedTx: tx });
        console.log('unsigned pubkey', tx.serialize().toString('hex'));

        const resp = (await blockstackApp.sign(`m/44'/5757'/0'/0/0`, tx.serialize())) as {
          signatureCompact: Buffer;
        };

        console.log({ ...resp, string: resp.signatureCompact.toString('hex') });

        // const message = Buffer.from(
        //   '00000000010400149be4d6c4667e4fb6d461e7c8378fa5a5e10c9f000000000000000a00000000000004e200010e997280fe04c9976e70d90a93b9f86507247f5e9fa78ec95cd4eebb27b23f3338a13f549bee779b646bffff41611c9eae53b65e6b7a911b00c906a36ad5920a0302000000000005169eb0a31b22af43679e4f58ce400ed641c28113a6000000000000138800000000000000000000000000000000000000000000000000000000000000000000',
        //   'hex'
        // );

        // const d = deserializeTransaction(new BufferReader(message));

        // console.log({ d });
        // const signedTx = await blockstackApp.sign(`m/44'/5757'/0'/0/0`, message);

        // console.log({ ...signedTx });

        // console.log({ tx });
        // const resp = await blockstackApp.sign(`m/44'/5757'/0'/0/0`, tx.serialize());
        // console.log({ ...resp, string: resp.signatureCompact.toString('hex') });
        const lastTwoBytes = resp.signatureCompact.slice(
          resp.signatureCompact.length - 2,
          resp.signatureCompact.length
        );
        const reformattedBuffer = Buffer.concat([
          lastTwoBytes,
          resp.signatureCompact.slice(0, resp.signatureCompact.length - 2),
        ]);

        if (tx.auth.spendingCondition) {
          tx.auth.spendingCondition.signature = new MessageSignature(
            reformattedBuffer.toString('hex')
          );
        }
        console.log('tx after changing signature', tx.serialize().toString('hex'));

        dispatch(
          broadcastStxTransaction({ signedTx: tx, amount, onBroadcastSuccess: closeModalResetForm })
        );
      } catch (e) {
        console.log(e);
      }
    }

    setIsDecrypting(false);
  };

  const totalIsMoreThanBalance = total.isGreaterThan(balance);
  const exceedsMaxLengthBytes = (string: string, maxLengthBytes: number): boolean =>
    string ? Buffer.from(string).length > maxLengthBytes : false;
  const form = useFormik({
    initialValues: {
      recipient: '',
      amount: '',
      memo: '',
    },
    validationSchema: yup.object().shape({
      recipient: yup
        .string()
        .test('test-is-stx-address', 'Must be a valid Stacks Address', (value = '') =>
          validateStacksAddress(value)
        )
        .test('test-is-for-valid-chain', 'Address is for incorrect network', (value = '') =>
          validateAddressChain(value)
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
          (value: number) => {
            // Explicit base ensures BigNumber doesn't use exponential notation
            const decimals = new BigNumber(value).toString(10).split('.')[1];
            return decimals === undefined || decimals.length <= 6;
          }
        )
        .test(
          'test-address-has-enough-balance',
          'Cannot send more STX than available balance',
          (value: number) => {
            // If there's no input, pass this test,
            // otherwise it'll render the error for this test
            if (value === undefined) return true;
            const enteredAmount = stxToMicroStx(value);
            return enteredAmount.isLessThanOrEqualTo(balance);
          }
        )
        .required(),
      memo: yup
        .string()
        .test(
          'test-max-memo-length',
          'Transaction memo cannot exceed 34 bytes',
          (value = '') => !exceedsMaxLengthBytes(value, MEMO_MAX_LENGTH_BYTES)
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
        // TODO: find common burn address
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

  if (!txModalOpen) return null;

  const closeModalResetForm = () => {
    dispatch(homeActions.closeTxModal());
    form.resetForm();
  };

  const proceedToSignTransactionStep = () =>
    walletType === 'software'
      ? setStep(TxModalStep.DecryptWalletAndSend)
      : setStep(TxModalStep.SignWithLedgerAndSend);

  const txFormStepMap: { [step in TxModalStep]: ModalComponents } = {
    [TxModalStep.DescribeTx]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Send STX</TxModalHeader>,
      body: (
        <>
          ST4VFKC1WG386T43ZSMWTVM9TQGCXHR3R1VF99RV
          <TxModalForm balance={balance} form={form} />
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
          {JSON.stringify(broadcastError)}
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
      body: <SignTxWithLedger onLedgerConnect={blockstackApp => broadcastTx(blockstackApp)} />,
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={() => setStep(TxModalStep.PreviewTx)} {...buttonStyle}>
            Go back
          </Button>
          <Button ml="base-tight" {...buttonStyle}>
            Sign transaction
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
