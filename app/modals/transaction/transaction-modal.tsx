import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BN from 'bn.js';
import { BigNumber } from 'bignumber.js';
import { Modal, Text, Button, Box } from '@blockstack/ui';
import { makeSTXTokenTransfer } from '@blockstack/stacks-transactions';
import { useHotkeys } from 'react-hotkeys-hook';

import { RootState } from '../../store';
import { validateStacksAddress } from '../../utils/get-stx-transfer-direction';

import { selectTxModalOpen, homeActions } from '../../store/home/home.reducer';
import { TxModalForm } from './transaction-form';
import { selectEncryptedMnemonic, selectSalt, decryptSoftwareWallet } from '../../store/keys';
import {
  TxModalHeader,
  buttonStyle,
  TxModalFooter,
  TxModalPreview,
  TxModalPreviewItem,
  modalStyle,
} from './transaction-modal-layout';
import { validateAddressChain } from '../../crypto/validate-address-net';
import { broadcastStxTransaction, selectMostRecentlyTxError } from '../../store/transaction';
import { toHumanReadableStx, stxToMicroStx } from '../../utils/unit-convert';
import { ErrorLabel } from '../../components/error-label';
import { ErrorText } from '../../components/error-text';
import { stacksNetwork } from '../../environment';
import { DecryptWalletForm } from './decrypt-wallet-form';

interface TxModalProps {
  balance: string;
  address: string;
}

enum TxModalStep {
  DescribeTx,
  PreviewTx,
  ConfirmAndSend,
}

type ModalComponents = () => {
  [component in 'header' | 'body' | 'footer']: JSX.Element;
};

export const TransactionModal: FC<TxModalProps> = ({ balance, address }) => {
  const dispatch = useDispatch();
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
  const { txModalOpen, encryptedMnemonic, salt, broadcastError } = useSelector(
    (state: RootState) => ({
      txModalOpen: selectTxModalOpen(state),
      salt: selectSalt(state),
      encryptedMnemonic: selectEncryptedMnemonic(state),
      broadcastError: selectMostRecentlyTxError(state),
    })
  );

  const broadcastTx = async () => {
    if (!password || !encryptedMnemonic || !salt) return;
    setHasSubmitted(true);
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
    setIsDecrypting(false);
  };

  const totalIsMoreThanBalance = total.isGreaterThan(balance);

  const form = useFormik({
    initialValues: {
      recipient: '',
      amount: '',
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
            onClick={() => setStep(TxModalStep.ConfirmAndSend)}
          >
            Sign transaction and send
          </Button>
        </TxModalFooter>
      ),
    }),
    [TxModalStep.ConfirmAndSend]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Confirm and send</TxModalHeader>,
      body: (
        <>
          2b458638acb14f46af49384fe1d4b913
          <DecryptWalletForm
            onSetPassword={password => setPassword(password)}
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
            onClick={broadcastTx}
            {...buttonStyle}
          >
            Send transaction
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
