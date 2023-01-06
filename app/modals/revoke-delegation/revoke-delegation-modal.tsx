import React, { FC, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ContractCallOptions, StacksTransaction } from '@stacks/transactions';
import { useHotkeys } from 'react-hotkeys-hook';

import { selectPoxInfo } from '@store/stacking';
import { PostCoreNodeTransactionsError } from '@stacks/stacks-blockchain-api-types';

import { REVOKE_DELEGATION_TX_SIZE_BYTES } from '@constants/index';
import { safeAwait } from '@utils/safe-await';
import { homeActions } from '@store/home';
import { useStackingClient } from '@hooks/use-stacking-client';
import { useApi } from '@hooks/use-api';
import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { useBroadcastTx } from '@hooks/use-broadcast-tx';
import { useMempool } from '@hooks/use-mempool';
import { TxSigningModal } from '@modals/tx-signing-modal/tx-signing-modal';
import { useCalculateFee } from '@hooks/use-calculate-fee';

export const RevokeDelegationModal: FC = () => {
  const dispatch = useDispatch();

  useHotkeys('esc', () => void dispatch(homeActions.closeRevokeDelegationModal()));
  const closeModal = () => dispatch(homeActions.closeRevokeDelegationModal());

  const api = useApi();
  const { stackingClient } = useStackingClient();
  const { broadcastTx, isBroadcasting } = useBroadcastTx();
  const { refetch: refetchMempool } = useMempool();
  const calcFee = useCalculateFee();
  const poxInfo = useSelector(selectPoxInfo);

  const [nodeResponseError, setNodeResponseError] = useState<PostCoreNodeTransactionsError | null>(
    null
  );

  const revocationTxOptions = useMemo((): ContractCallOptions => {
    if (!poxInfo) throw new Error('`poxInfo` undefined');
    return {
      ...stackingClient.getRevokeDelegateStxOptions(poxInfo.contract_id),
      fee: calcFee(REVOKE_DELEGATION_TX_SIZE_BYTES).toString(),
    };
  }, [calcFee, poxInfo, stackingClient]);

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
        },
        tx: signedTx,
      }),
    [api.baseUrl, broadcastTx, dispatch, refetchMempool]
  );

  return (
    <TxSigningModal
      action="revoke delegation"
      txDetails={revocationTxOptions}
      isBroadcasting={isBroadcasting}
      error={nodeResponseError}
      onTransactionSigned={tx => revokeDelegation(tx)}
      onTryAgain={() => setNodeResponseError(null)}
      onClose={closeModal}
    />
  );
};
