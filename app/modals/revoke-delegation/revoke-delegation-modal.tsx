import React, { FC, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@stacks/ui';
import { ContractCallOptions, StacksTransaction } from '@stacks/transactions';
import { useHotkeys } from 'react-hotkeys-hook';
import BN from 'bn.js';

import { selectPoxInfo } from '@store/stacking';

import { safeAwait } from '@utils/safe-await';
import { homeActions } from '@store/home';
import { useStackingClient } from '@hooks/use-stacking-client';
import { useApi } from '@hooks/use-api';

import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';

import { useBroadcastTx } from '@hooks/use-broadcast-tx';
import { useMempool } from '@hooks/use-mempool';
import { SignTransaction } from '@components/tx-signing/sign-transaction';
import { useLatestNonce } from '@hooks/use-latest-nonce';

import { StackingModalHeader as Header, modalStyle } from '../components/stacking-modal-layout';
import { PostCoreNodeTransactionsError } from '@blockstack/stacks-blockchain-api-types';
import { TransactionError } from '@modals/components/transaction-error';

enum RevokeDelegationModalStep {
  SignTransaction,
  FailedContractCall,
}

export const RevokeDelegationModal: FC = () => {
  const dispatch = useDispatch();

  useHotkeys('esc', () => void dispatch(homeActions.closeRevokeDelegationModal()));
  const closeModal = () => dispatch(homeActions.closeRevokeDelegationModal());

  const api = useApi();
  const { stackingClient } = useStackingClient();
  const { nonce } = useLatestNonce();
  const { broadcastTx, isBroadcasting } = useBroadcastTx();
  const { refetch: refetchMempool } = useMempool();
  const poxInfo = useSelector(selectPoxInfo);

  const initialStep = RevokeDelegationModalStep.SignTransaction;

  const [step, setStep] = useState(initialStep);
  const [nodeResponseError, setNodeResponseError] = useState<PostCoreNodeTransactionsError | null>(
    null
  );

  const getRevocationTxOptions = useCallback((): ContractCallOptions => {
    if (!poxInfo) throw new Error('`poxInfo` undefined');
    return {
      ...stackingClient.getRevokeDelegateStxOptions(poxInfo.contract_id),
      nonce: new BN(nonce),
    };
  }, [poxInfo, nonce, stackingClient]);

  const revokeDelegation = useCallback(
    (signedTx: StacksTransaction) =>
      broadcastTx({
        onSuccess: async txId => {
          await safeAwait(watchForNewTxToAppear({ txId, nodeUrl: api.baseUrl }));
          await refetchMempool();
          dispatch(homeActions.closeRevokeDelegationModal());
        },
        onFail: (error?: any) => {
          if (error) setNodeResponseError(error);
          setStep(RevokeDelegationModalStep.FailedContractCall);
        },
        tx: signedTx,
      }),
    [api.baseUrl, broadcastTx, dispatch, refetchMempool]
  );

  const revokeDelegationStepMap: Record<RevokeDelegationModalStep, () => JSX.Element> = {
    [RevokeDelegationModalStep.SignTransaction]: () => (
      <>
        <Header onSelectClose={closeModal}>Confirm and revoke delegation</Header>
        <SignTransaction
          action="revoke delegation"
          txOptions={getRevocationTxOptions()}
          isBroadcasting={isBroadcasting}
          onClose={closeModal}
          onTransactionSigned={tx => revokeDelegation(tx)}
        />
      </>
    ),
    [RevokeDelegationModalStep.FailedContractCall]: () => (
      <TransactionError
        error={nodeResponseError}
        onClose={closeModal}
        onGoBack={() => setStep(initialStep)}
      />
    ),
  };

  return (
    <Modal isOpen {...modalStyle}>
      {revokeDelegationStepMap[step]()}
    </Modal>
  );
};
