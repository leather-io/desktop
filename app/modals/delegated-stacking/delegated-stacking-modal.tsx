import React, { FC, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';
import { Modal } from '@stacks/ui';
import BN from 'bn.js';

import { RootState } from '@store/index';
import routes from '@constants/routes.json';

import { selectPoxInfo } from '@store/stacking';
import { safeAwait } from '@utils/safe-await';

import {
  StackingModalHeader as Header,
  modalStyle,
} from '@modals/components/stacking-modal-layout';

import { useStackingClient } from '@hooks/use-stacking-client';

import { useApi } from '@hooks/use-api';
import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { useBroadcastTx } from '@hooks/use-broadcast-tx';
import { ContractCallOptions, StacksTransaction } from '@stacks/transactions';
import { useMempool } from '@hooks/use-mempool';

import { SignTransaction } from '@components/tx-signing/sign-transaction';
import { useLatestNonce } from '@hooks/use-latest-nonce';
import { PostCoreNodeTransactionsError } from '@blockstack/stacks-blockchain-api-types';
import { TransactionError } from '@modals/components/transaction-error';

enum StackingModalStep {
  SignTransaction,
  FailedContractCall,
}

interface StackingModalProps {
  delegateeStxAddress: string;
  amountToStack: BigNumber;
  burnHeight?: number;
  onClose(): void;
}

export const DelegatedStackingModal: FC<StackingModalProps> = props => {
  const { onClose, delegateeStxAddress, amountToStack, burnHeight } = props;

  const history = useHistory();
  useHotkeys('esc', () => onClose());

  const { nonce } = useLatestNonce();
  const { stackingClient } = useStackingClient();
  const { broadcastTx, isBroadcasting } = useBroadcastTx();

  const { refetch } = useMempool();

  const api = useApi();

  const { poxInfo } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
  }));

  const initialStep = StackingModalStep.SignTransaction;

  const [step, setStep] = useState(initialStep);
  const [nodeResponseError, setNodeResponseError] = useState<PostCoreNodeTransactionsError | null>(
    null
  );
  const createDelegationTxOptions = useCallback((): ContractCallOptions => {
    if (!poxInfo) throw new Error('`poxInfo` undefined');
    return {
      ...stackingClient.getDelegateOptions({
        amountMicroStx: new BN(amountToStack.toString()),
        contract: poxInfo.contract_id,
        delegateTo: delegateeStxAddress,
        untilBurnBlockHeight: burnHeight,
      }),
      nonce: new BN(nonce),
    };
  }, [poxInfo, stackingClient, amountToStack, delegateeStxAddress, burnHeight, nonce]);

  const delegateStx = (signedTx: StacksTransaction) =>
    broadcastTx({
      onSuccess: async txId => {
        await safeAwait(watchForNewTxToAppear({ txId, nodeUrl: api.baseUrl }));
        await refetch();
        history.push(routes.HOME);
      },
      onFail: err => {
        if (err) setNodeResponseError(err);
        setStep(StackingModalStep.FailedContractCall);
      },
      tx: signedTx,
    });

  const txFormStepMap: Record<StackingModalStep, () => JSX.Element> = {
    [StackingModalStep.SignTransaction]: () => (
      <>
        <Header onSelectClose={onClose}>Confirm and delegate</Header>
        <SignTransaction
          action="initate delegation"
          txOptions={createDelegationTxOptions()}
          isBroadcasting={isBroadcasting}
          onClose={onClose}
          onTransactionSigned={tx => delegateStx(tx)}
        />
      </>
    ),

    [StackingModalStep.FailedContractCall]: () => (
      <TransactionError
        error={nodeResponseError}
        onClose={onClose}
        onGoBack={() => setStep(initialStep)}
      />
    ),
  };

  const body = txFormStepMap[step]();

  return (
    <Modal isOpen {...modalStyle}>
      {body}
    </Modal>
  );
};
