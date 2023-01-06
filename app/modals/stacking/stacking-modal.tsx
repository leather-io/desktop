import React, { FC, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';

import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import { activeStackingTx, selectCoreNodeInfo, selectPoxInfo } from '@store/stacking';
import { StacksTransaction } from '@stacks/transactions';
import { useStackingClient } from '@hooks/use-stacking-client';
import { useApi } from '@hooks/use-api';
import { safeAwait } from '@utils/safe-await';

import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { useBroadcastTx } from '@hooks/use-broadcast-tx';
import { useMempool } from '@hooks/use-mempool';
import { PostCoreNodeTransactionsError } from '@stacks/stacks-blockchain-api-types';
import { TxSigningModal } from '@modals/tx-signing-modal/tx-signing-modal';

interface StackingModalProps {
  poxAddress: string;
  numCycles: number;
  amountToStack: BigNumber;
  fee: BigNumber;
  onClose(): void;
}
export const StackingModal: FC<StackingModalProps> = props => {
  const { onClose, numCycles, poxAddress, amountToStack, fee } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  useHotkeys('esc', () => onClose());

  const { stackingClient } = useStackingClient();
  const { broadcastTx, isBroadcasting } = useBroadcastTx();
  const { refetch } = useMempool();
  const api = useApi();

  const { poxInfo, coreNodeInfo } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
    coreNodeInfo: selectCoreNodeInfo(state),
  }));

  const [nodeResponseError, setNodeResponseError] = useState<PostCoreNodeTransactionsError | null>(
    null
  );
  const stackingTxOptions = useMemo(() => {
    if (!poxInfo) throw new Error('poxInfo not defined');
    if (!coreNodeInfo) throw new Error('Stacking requires coreNodeInfo');
    const stackingTxOptions = stackingClient.getStackOptions({
      amountMicroStx: amountToStack.toString(),
      poxAddress,
      cycles: numCycles,
      contract: poxInfo.contract_id,
      burnBlockHeight: coreNodeInfo.burn_block_height,
    });
    return { ...stackingTxOptions, fee: fee.toString() };
  }, [amountToStack, coreNodeInfo, numCycles, poxAddress, poxInfo, stackingClient, fee]);

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
      },
      tx: signedTx,
    });

  return (
    <TxSigningModal
      action="stack"
      txDetails={stackingTxOptions}
      isBroadcasting={isBroadcasting}
      error={nodeResponseError}
      onTryAgain={() => setNodeResponseError(null)}
      onTransactionSigned={tx => stackStx(tx)}
      onClose={onClose}
    />
  );
};
