import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';

import { Api } from '@api/api';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { selectActiveNodeApi } from '@store/stacks-node';
import { DEFAULT_POLLING_INTERVAL } from '@constants/index';

function getPendingTxsByAddress(address = '', txs: MempoolTransaction[] | undefined) {
  return txs
    ? txs.filter(
        tx =>
          (tx.tx_type === 'token_transfer' && tx.token_transfer.recipient_address === address) ||
          tx.sender_address === address
      )
    : [];
}

export function useMempool() {
  const { address, activeNode } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    activeNode: selectActiveNodeApi(state),
  }));
  const mempoolFetcher = useCallback(() => new Api(activeNode.url).getMempoolTransactions(), [
    activeNode,
  ]);
  const { data: mempoolTxs } = useSWR('mempool', mempoolFetcher, {
    refreshInterval: DEFAULT_POLLING_INTERVAL,
  });
  const inboundMempoolTxs = useMemo(() => getPendingTxsByAddress(address, mempoolTxs), [
    mempoolTxs,
    address,
  ]);
  const nonTokenTransferTxs = inboundMempoolTxs.filter(tx => tx.tx_type !== 'token_transfer');
  return { inboundMempoolTxs, nonTokenTransferTxs };
}
