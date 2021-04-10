import React, { FC, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from '@stacks/ui';
import { useHistory } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';
import BN from 'bn.js';

import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import { activeStackingTx, selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';
import { StacksTransaction } from '@stacks/transactions';
import { useStackingClient } from '@hooks/use-stacking-client';
import { useApi } from '@hooks/use-api';
import { safeAwait } from '@utils/safe-await';

import { StackingModalHeader as Header, modalStyle } from '../components/stacking-modal-layout';

import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { useBroadcastTx } from '@hooks/use-broadcast-tx';
import { useMempool } from '@hooks/use-mempool';
import { SignTransaction } from '@components/tx-signing/sign-transaction';
import { PostCoreNodeTransactionsError } from '@blockstack/stacks-blockchain-api-types';
import { TransactionError } from '@modals/components/transaction-error';
import { useLatestNonce } from '@hooks/use-latest-nonce';

enum StackingModalStep {
  SignTransaction,
  FailedContractCall,
}

interface StackingModalProps {
  poxAddress: string;
  numCycles: number;
  amountToStack: BigNumber;
  onClose(): void;
}

export const StackingModal: FC<StackingModalProps> = props => {
  const { onClose, numCycles, poxAddress, amountToStack } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  useHotkeys('esc', () => onClose());

  const { stackingClient } = useStackingClient();
  const { nonce } = useLatestNonce();
  const { broadcastTx, isBroadcasting } = useBroadcastTx();
  const { refetch } = useMempool();
  const api = useApi();

  const { poxInfo, coreNodeInfo } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
    coreNodeInfo: selectCoreNodeInfo(state),
  }));

  const initialStep = StackingModalStep.SignTransaction;
  const [step, setStep] = useState(initialStep);
  const [nodeResponseError, setNodeResponseError] = useState<PostCoreNodeTransactionsError | null>(
    null
  );
  const createStackingTxOptions = useCallback(() => {
    if (!poxInfo) throw new Error('poxInfo not defined');
    if (!coreNodeInfo) throw new Error('Stacking requires coreNodeInfo');
    return {
      ...stackingClient.getStackOptions({
        amountMicroStx: new BN(amountToStack.toString()),
        poxAddress,
        cycles: numCycles,
        contract: poxInfo.contract_id,
        burnBlockHeight: coreNodeInfo.burn_block_height,
      }),
      nonce: new BN(nonce),
    };
  }, [amountToStack, coreNodeInfo, numCycles, poxAddress, poxInfo, stackingClient, nonce]);

  const stackStx = (signedTx: StacksTransaction) =>
    broadcastTx({
      async onSuccess(txId) {
        dispatch(activeStackingTx({ txId }));
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

  const stackingTxStepMap: Record<StackingModalStep, () => JSX.Element> = {
    [StackingModalStep.SignTransaction]: () => (
      <>
        <Header onSelectClose={onClose}>Confirm and Stack</Header>
        <SignTransaction
          action="stack"
          txOptions={createStackingTxOptions()}
          isBroadcasting={isBroadcasting}
          onClose={onClose}
          onTransactionSigned={tx => stackStx(tx)}
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

  return (
    <Modal isOpen {...modalStyle}>
      {stackingTxStepMap[step]()}
    </Modal>
  );
};
