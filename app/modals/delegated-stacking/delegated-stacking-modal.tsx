import React, { FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { BigNumber } from 'bignumber.js';

import { RootState } from '@store/index';
import routes from '@constants/routes.json';
import { POOLED_STACKING_TX_SIZE_BYTES } from '@constants/index';

import { selectPoxInfo } from '@store/stacking';
import { safeAwait } from '@utils/safe-await';

import { useStackingClient } from '@hooks/use-stacking-client';

import { useApi } from '@hooks/use-api';
import { watchForNewTxToAppear } from '@api/watch-tx-to-appear-in-api';
import { useBroadcastTx } from '@hooks/use-broadcast-tx';
import { ContractCallOptions, StacksTransaction } from '@stacks/transactions';
import { useMempool } from '@hooks/use-mempool';

import { PostCoreNodeTransactionsError } from '@stacks/stacks-blockchain-api-types';

import { TxSigningModal } from '@modals/tx-signing-modal/tx-signing-modal';
import { useCalculateFee } from '@hooks/use-calculate-fee';

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

  const { stackingClient } = useStackingClient();
  const { broadcastTx, isBroadcasting } = useBroadcastTx();

  const { refetch } = useMempool();
  const calcFee = useCalculateFee();

  const api = useApi();

  const { poxInfo } = useSelector((state: RootState) => ({
    poxInfo: selectPoxInfo(state),
  }));

  const [nodeResponseError, setNodeResponseError] = useState<PostCoreNodeTransactionsError | null>(
    null
  );

  const delegationTxOptions = useMemo((): ContractCallOptions => {
    if (!poxInfo) throw new Error('`poxInfo` undefined');
    console.log(amountToStack.toString());
    return {
      ...stackingClient.getDelegateOptions({
        amountMicroStx: amountToStack.toString(),
        contract: poxInfo.contract_id,
        delegateTo: delegateeStxAddress,
        untilBurnBlockHeight: burnHeight,
      }),
      fee: calcFee(POOLED_STACKING_TX_SIZE_BYTES).toString(),
    };
  }, [amountToStack, burnHeight, calcFee, delegateeStxAddress, poxInfo, stackingClient]);

  const delegateStx = (signedTx: StacksTransaction) =>
    broadcastTx({
      onSuccess: async txId => {
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
      action="initiate pooling"
      txDetails={delegationTxOptions}
      isBroadcasting={isBroadcasting}
      error={nodeResponseError}
      onTryAgain={() => setNodeResponseError(null)}
      onTransactionSigned={tx => delegateStx(tx)}
      onClose={onClose}
    />
  );
};
