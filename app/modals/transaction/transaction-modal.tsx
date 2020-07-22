import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BN from 'bn.js';
import { Modal, Text, Button } from '@blockstack/ui';
import { StacksTransaction } from '@blockstack/stacks-transactions';

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
import { humanReadableStx, stxToMicroStx } from '../../utils/format-stx';
import { BigNumber } from 'bignumber.js';

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
        .positive('You cannot send a negative amount of STX')
        .typeError('Amount of STX must be described as number')
        .min(1, 'Smallest transaction is 1 STX')
        .test(
          'test-has-less-than-or-equal-to-6-decimal-places',
          'STX cannot have more than 6 decimal places',
          (value: number) => {
            const decimals = new BigNumber(value).toString().split('.')[1];
            return decimals === undefined || decimals.length <= 6;
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
    form.resetForm();
  };

  const broadcastTx = () => {
    if (tx === null) return;
    dispatch(broadcastStxTransaction({ tx }));
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
            {humanReadableStx(amount.toString())}
          </TxModalPreviewItem>
          <TxModalPreviewItem label="Fee">{humanReadableStx(fee)}</TxModalPreviewItem>
          <TxModalPreviewItem label="Total">
            {humanReadableStx(total.toString())}
          </TxModalPreviewItem>
        </TxModalPreview>
      ),
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={() => setStep(TxModalStep.DescribeTx)} {...buttonStyle}>
            Go back
          </Button>
          <Button ml="base-tight" {...buttonStyle} onClick={broadcastTx}>
            Confirm and send
          </Button>
        </TxModalFooter>
      ),
    }),
  };

  const { header, body, footer } = txFormStepMap[step]();

  return (
    <Modal isOpen={txModalOpen} headerComponent={header} footerComponent={footer} {...modalStyle}>
      {body}
    </Modal>
  );
};
