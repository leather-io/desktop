import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BN from 'bn.js';
import { BigNumber } from 'bignumber.js';
import { Modal, Text, Button, Box } from '@blockstack/ui';
import { StacksTransaction } from '@blockstack/stacks-transactions';
import { useHotkeys } from 'react-hotkeys-hook';

import { RootState } from '../../store';
import { validateStacksAddress } from '../../utils/get-stx-transfer-direction';

import { selectTxModalOpen, homeActions } from '../../store/home/home.reducer';
import { TxModalForm } from './transaction-form';
import { selectMnemonic } from '../../store/keys';
import {
  TxModalHeader,
  buttonStyle,
  TxModalFooter,
  TxModalPreview,
  TxModalPreviewItem,
  modalStyle,
} from './transaction-modal-layout';
import { createStxTransaction } from '../../crypto/create-stx-tx';
import { validateAddressChain } from '../../crypto/validate-address-net';
import { broadcastStxTransaction } from '../../store/transaction';
import { toHumanReadableStx, stxToMicroStx } from '../../utils/unit-convert';
import { ErrorLabel } from '../../components/error-label';
import { ErrorText } from '../../components/error-text';

interface TxModalProps {
  balance: string;
  address: string;
}

enum TxModalStep {
  DescribeTx,
  PreviewAndSend,
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
  const [total, setTotal] = useState(new BigNumber(0));
  const [tx, setTx] = useState<null | StacksTransaction>(null);
  const [loading, setLoading] = useState(false);
  const { mnemonic, txModalOpen } = useSelector((state: RootState) => ({
    txModalOpen: selectTxModalOpen(state),
    mnemonic: selectMnemonic(state),
  }));

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
      if (!mnemonic) return;
      setLoading(true);
      const tx = await createStxTransaction({
        mnemonic,
        recipient: form.values.recipient,
        amount: stxToMicroStx(form.values.amount),
      });
      const { amount, fee } = {
        amount: stxToMicroStx(form.values.amount),
        fee: tx.auth.spendingCondition?.fee as BN,
      };
      setTx(tx);
      setFee(fee);
      setTotal(amount.plus(fee.toString()));
      setAmount(amount);
      setStep(TxModalStep.PreviewAndSend);
      setLoading(false);
    },
  });

  if (!txModalOpen) return null;

  const closeModalResetForm = () => {
    dispatch(homeActions.closeTxModal());
    setStep(TxModalStep.DescribeTx);
    setLoading(false);
    setTx(null);
    setFee(new BN(0));
    setAmount(new BigNumber(0));
    form.resetForm();
  };

  const broadcastTx = () => {
    if (tx === null) return;
    setLoading(true);
    dispatch(
      broadcastStxTransaction({ signedTx: tx, amount, onBroadcastSuccess: closeModalResetForm })
    );
  };

  const txFormStepMap: { [step in TxModalStep]: ModalComponents } = {
    [TxModalStep.DescribeTx]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Send STX</TxModalHeader>,
      body: <TxModalForm balance={balance} form={form} />,
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
    [TxModalStep.PreviewAndSend]: () => ({
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Confirm and send</TxModalHeader>,
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
            onClick={broadcastTx}
          >
            Confirm and send
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
