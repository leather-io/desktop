import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Text, Button } from '@blockstack/ui';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BN from 'bn.js';

import { RootState } from '../../store';
import { validateStacksAddress } from '../../utils/get-stx-transfer-direction';
import { broadcastStxTransaction } from '../../store/transaction/transaction.actions';
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

interface TxModalProps {
  balance: string;
  address: string;
}

enum TxModalStep {
  DescribeTx,
  PreviewAndSend,
}

type ModalComponents = {
  [component in 'header' | 'body' | 'footer']: JSX.Element;
};

export const TransactionModal: FC<TxModalProps> = ({ balance, address }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(TxModalStep.DescribeTx);
  const { txModalOpen } = useSelector((state: RootState) => ({
    txModalOpen: selectTxModalOpen(state),
  }));

  const form = useFormik({
    initialValues: {
      address: '',
      amount: '',
    },
    validationSchema: yup.object().shape({
      address: yup
        .string()
        .test('test-is-stx-address', 'Must be a valid Stacks Address', value =>
          validateStacksAddress(value)
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
        .required(),
    }),
    onSubmit: () => setStep(TxModalStep.PreviewAndSend),
  });

  if (!txModalOpen) return null;

  const closeModalResetForm = () => {
    dispatch(homeActions.closeTxModal());
    setStep(TxModalStep.DescribeTx);
    form.resetForm();
  };

  const broadcastTx = () =>
    dispatch(
      broadcastStxTransaction({
        recipient: form.values.address,
        amount: new BN(form.values.amount),
      })
    );

  const txFormStepMap: { [step in TxModalStep]: ModalComponents } = {
    [TxModalStep.DescribeTx]: {
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Send STX</TxModalHeader>,
      body: <TxModalForm balance={balance} form={form} />,
      footer: (
        <TxModalFooter>
          <Button mode="tertiary" onClick={closeModalResetForm} {...buttonStyle}>
            Cancel
          </Button>
          <Button ml="base-tight" onClick={() => form.submitForm()} {...buttonStyle}>
            Preview
          </Button>
        </TxModalFooter>
      ),
    },
    [TxModalStep.PreviewAndSend]: {
      header: <TxModalHeader onSelectClose={closeModalResetForm}>Confirm and send</TxModalHeader>,
      body: (
        <TxModalPreview>
          <TxModalPreviewItem label="To">
            <Text fontSize="13px">{form.values.address}</Text>
          </TxModalPreviewItem>
          <TxModalPreviewItem label="Amount">{form.values.amount}</TxModalPreviewItem>
          <TxModalPreviewItem label="Fee">0.0323 STX</TxModalPreviewItem>
          <TxModalPreviewItem label="Total">18929 STX</TxModalPreviewItem>
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
    },
  };

  const { header, body, footer } = txFormStepMap[step];

  return (
    <Modal isOpen={txModalOpen} headerComponent={header} footerComponent={footer} {...modalStyle}>
      {body}
    </Modal>
  );
};
