import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import BN from 'bn.js';
import { Modal, Text, Button, safeAwait } from '@blockstack/ui';
import { broadcastTransaction, StacksTransaction } from '@blockstack/stacks-transactions';

import { RootState, Dispatch } from '../../store';
import { validateStacksAddress } from '../../utils/get-stx-transfer-direction';
// import { broadcastStxTransaction } from '../../store/transaction/transaction.actions';
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
import { stacksNetwork } from '../../crypto/environment';
import { createStxTransaction } from '../../crypto/create-stx-tx';
import { validateAddressChain } from '../../crypto/validate-address-net';

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
  const [tx, setTx] = useState<null | StacksTransaction>(null);
  const [loading, setLoading] = useState(false);
  const { mnemonic, txModalOpen } = useSelector((state: RootState) => ({
    txModalOpen: selectTxModalOpen(state),
    mnemonic: selectMnemonic(state),
  }));

  const form = useFormik({
    initialValues: {
      address: '',
      amount: '',
    },
    validationSchema: yup.object().shape({
      address: yup
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
        .required(),
    }),
    onSubmit: async () => {
      if (!mnemonic) return;
      setLoading(true);
      const tx = await createStxTransaction({
        mnemonic,
        recipient: form.values.address,
        amount: new BN(form.values.amount),
      });
      // handle errors
      setTx(tx);
      setFee(tx.auth.spendingCondition?.fee as BN);
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

  interface BroadcastStxTxArgs {
    amount: BN;
    recipient: string;
  }

  function broadcastStxTransaction({ tx }: { tx: StacksTransaction }) {
    return async (dispatch: Dispatch, getState: () => RootState) => {
      const [error, blockchainResponse] = await safeAwait(broadcastTransaction(tx, stacksNetwork));

      if (error || !blockchainResponse) return null;
      console.log({ error });
      // anything but string of id === error
      console.log(blockchainResponse);
      if (typeof blockchainResponse !== 'string') {
        // setError for ui
        return;
      }
      // dispatch(
      //   addPendingTransaction({
      //     txId: pendingTxId as string,
      //     amount: amount.toString(),
      //     time: +new Date(),
      //   })
      // );
      return blockchainResponse;
    };
  }

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
            <Text fontSize="13px">{form.values.address}</Text>
          </TxModalPreviewItem>
          <TxModalPreviewItem label="Amount">{form.values.amount}</TxModalPreviewItem>
          <TxModalPreviewItem label="Fee">{fee.toString()} µSTX</TxModalPreviewItem>
          <TxModalPreviewItem label="Total">
            {new BN(form.values.amount).add(fee).toString()} µSTX
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
