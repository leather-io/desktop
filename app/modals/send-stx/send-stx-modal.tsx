import { stacksNetwork } from '../../environment';
import { TxModalFooter, TxModalButton, modalStyle } from './send-stx-modal-layout';
import { PreviewTransaction } from './steps/preview-transaction';
import { TxModalForm } from './steps/transaction-form';
import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { SignTransaction } from '@components/tx-signing/sign-transaction';
import { STX_DECIMAL_PRECISION, STX_TRANSFER_TX_SIZE_BYTES } from '@constants/index';
import { validateAddressChain } from '@crypto/validate-address-net';
import { useAnalytics } from '@hooks/use-analytics';
import { useApi } from '@hooks/use-api';
import { useBalance } from '@hooks/use-balance';
import { useBroadcastTx } from '@hooks/use-broadcast-tx';
import { useCalculateFee } from '@hooks/use-calculate-fee';
import { useLatestNonce } from '@hooks/use-latest-nonce';
import { Modal } from '@modals/components/base-modal';
import { ModalHeader } from '@modals/components/modal-header';
import { TransactionError } from '@modals/components/transaction-error';
import { PostCoreNodeTransactionsError } from '@stacks/stacks-blockchain-api-types';
import {
  AnchorMode,
  MEMO_MAX_LENGTH_BYTES,
  StacksTransaction,
  TokenTransferOptions,
} from '@stacks/transactions';
import { homeActions } from '@store/home';
import { delay } from '@utils/delay';
import { validateDecimalPrecision } from '@utils/form/validate-decimals';
import { validateStacksAddress } from '@utils/get-stx-transfer-direction';
import { safeAwait } from '@utils/safe-await';
import { stxToMicroStx, microStxToStx } from '@utils/unit-convert';
import { HomeSelectors } from 'app/tests/features/home.selectors';
import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';
import React, { FC, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

interface TxModalProps {
  balance: string;
  isOpen?: boolean;
  address: string;
}

enum TxModalStep {
  DescribeTx,
  PreviewTx,
  SignTransaction,
  NetworkError,
}

export const SendStxModal: FC<TxModalProps> = ({ address, isOpen }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const stacksApi = useApi();
  const [step, setStep] = useState(TxModalStep.DescribeTx);
  const [fee, setFee] = useState(new BigNumber(0));
  const [calculatingMaxSpend, setCalculatingMaxSpend] = useState(false);
  const [amount, setAmount] = useState(new BigNumber(0));
  const [total, setTotal] = useState(new BigNumber(0));
  const { availableBalance: balance } = useBalance();
  const { broadcastTx, isBroadcasting } = useBroadcastTx();
  const calcFee = useCalculateFee();

  const [feeEstimateError, setFeeEstimateError] = useState<string | null>(null);

  const [nodeResponseError, setNodeResponseError] = useState<PostCoreNodeTransactionsError | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { nonce } = useLatestNonce();

  const [txDetails, setTxDetails] = useState<TokenTransferOptions | null>(null);

  const analytics = useAnalytics();

  const totalIsMoreThanBalance = total.isGreaterThan(balance);

  const exceedsMaxLengthBytes = (string: string, maxLengthBytes: number): boolean =>
    string ? Buffer.from(string).length > maxLengthBytes : false;

  const form = useFormik({
    initialValues: {
      recipient: '',
      amount: '',
      memo: '',
      noMemoRequired: false,
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
          value => validateDecimalPrecision(STX_DECIMAL_PRECISION)(value)
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
            return enteredAmount.isLessThanOrEqualTo(balance);
          }
        )
        .required(),
      memo: yup.string().when('noMemoRequired', {
        is: false,
        then: yup
          .string()
          .required()
          .test({
            name: 'memo-required',
            message: 'Memo is required. If you do not need to set a memo, confirm this below.',
            test(value: unknown) {
              if (typeof value !== 'string') return false;
              if (value.trim() === '') return false;
              return true;
            },
          })
          .test('test-max-memo-length', 'Transaction memo cannot exceed 34 bytes', (value = '') =>
            value === null ? false : !exceedsMaxLengthBytes(value, MEMO_MAX_LENGTH_BYTES)
          ),
      }),
      noMemoRequired: yup.boolean().required(),
    }),
    onSubmit() {
      setLoading(true);
      setFeeEstimateError(null);
      const fee = calcFee(STX_TRANSFER_TX_SIZE_BYTES);
      const amount = stxToMicroStx(form.values.amount);
      setFee(fee);
      setTotal(amount.plus(fee.toString()));
      setAmount(amount);
      setStep(TxModalStep.PreviewTx);

      setTxDetails({
        recipient: form.values.recipient,
        network: stacksNetwork,
        amount: stxToMicroStx(form.values.amount || 0).toString(),
        memo: form.values.memo,
        nonce: nonce,
        fee: fee.toString(),
        anchorMode: AnchorMode.Any,
      });
      setLoading(false);
    },
  });

  const resetAll = () => {
    setTxDetails(null);
    setStep(TxModalStep.DescribeTx);
    setLoading(false);
    setFee(new BigNumber(0));
    setAmount(new BigNumber(0));
    setTotal(new BigNumber(0));
    setFeeEstimateError(null);
    setNodeResponseError(null);
    form.resetForm();
  };
  const closeModal = () => {
    resetAll();
    dispatch(homeActions.closeTxModal());
  };
  useHotkeys('esc', closeModal);
  const sendStx = (tx: StacksTransaction) => {
    void analytics.track('broadcast_transaction');
    broadcastTx({
      async onSuccess(txId: string) {
        await safeAwait(watchForNewTxToAppear({ txId, nodeUrl: stacksApi.baseUrl }));
        await safeAwait(queryClient.refetchQueries(['mempool']));
        closeModal();
        resetAll();
      },
      onFail: (error?: PostCoreNodeTransactionsError) => {
        if (error) setNodeResponseError(error);
        setStep(TxModalStep.NetworkError);
      },
      tx,
    });
  };

  const updateAmountFieldToMaxBalance = async () => {
    setCalculatingMaxSpend(true);
    await delay(300);
    const fee = calcFee(STX_TRANSFER_TX_SIZE_BYTES);
    const balanceLessFee = new BigNumber(balance).minus(fee.toString());
    if (balanceLessFee.isLessThanOrEqualTo(0)) {
      void form.setFieldTouched('amount');
      form.setFieldError('amount', 'Your balance is not sufficient to cover the transaction fee');
      setCalculatingMaxSpend(false);
      return;
    }
    await form.setValues({
      ...form.values,
      amount: microStxToStx(balanceLessFee.toString()).toString(),
    });
    setCalculatingMaxSpend(false);
  };

  function DescribeTxComponent() {
    return (
      <>
        <ModalHeader onSelectClose={closeModal}>Send STX</ModalHeader>
        <TxModalForm
          balance={balance.toString()}
          form={form && form}
          isCalculatingMaxSpend={calculatingMaxSpend}
          onSendEntireBalance={updateAmountFieldToMaxBalance}
          feeEstimateError={feeEstimateError}
        />

        <TxModalFooter>
          <TxModalButton mode="tertiary" onClick={closeModal}>
            Cancel
          </TxModalButton>
          <TxModalButton
            onClick={() => form.submitForm()}
            isLoading={loading}
            data-test={HomeSelectors.BtnSendStxFormPreview}
          >
            Preview
          </TxModalButton>
        </TxModalFooter>
      </>
    );
  }

  function PreviewTxComponent() {
    return (
      <>
        <ModalHeader onSelectClose={closeModal}>Preview transaction</ModalHeader>
        <PreviewTransaction
          recipient={form.values.recipient}
          amount={amount.toString()}
          fee={fee.toString()}
          total={total.toString()}
          memo={form.values.memo}
          nonce={nonce}
          totalExceedsBalance={totalIsMoreThanBalance}
        />

        <TxModalFooter>
          <TxModalButton mode="tertiary" onClick={() => setStep(TxModalStep.DescribeTx)}>
            Go back
          </TxModalButton>
          <TxModalButton
            isLoading={loading}
            isDisabled={totalIsMoreThanBalance}
            data-test={HomeSelectors.BtnSendStxFormSend}
            onClick={() => setStep(TxModalStep.SignTransaction)}
          >
            Send
          </TxModalButton>
        </TxModalFooter>
      </>
    );
  }

  function SignTransactionComponent() {
    return (
      <>
        <ModalHeader onSelectClose={closeModal}>Confirm and send</ModalHeader>
        {txDetails !== null && (
          <SignTransaction
            action="send STX"
            txOptions={txDetails}
            isBroadcasting={isBroadcasting}
            onClose={closeModal}
            onTransactionSigned={tx => sendStx(tx)}
          />
        )}
      </>
    );
  }

  function NetworkErrorComponent() {
    return (
      <TransactionError
        error={nodeResponseError}
        onClose={closeModal}
        onGoBack={() => setStep(TxModalStep.DescribeTx)}
      />
    );
  }

  const txFormStepMap: Record<TxModalStep, () => JSX.Element> = {
    [TxModalStep.DescribeTx]: DescribeTxComponent,
    [TxModalStep.PreviewTx]: PreviewTxComponent,
    [TxModalStep.SignTransaction]: SignTransactionComponent,
    [TxModalStep.NetworkError]: NetworkErrorComponent,
  };

  return (
    <Modal handleClose={closeModal} {...modalStyle} isOpen={!!isOpen}>
      {txFormStepMap[step]()}
    </Modal>
  );
};
