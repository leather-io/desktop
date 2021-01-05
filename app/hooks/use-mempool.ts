import { useCallback } from 'react';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';

import { Api } from '@api/api';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { selectActiveNodeApi } from '@store/stacks-node';

function filteredResults(txs: MempoolTransaction[], address = '') {
  return txs.filter(
    tx => tx.tx_type === 'token_transfer' && tx.token_transfer.recipient_address === address
  );
}

export function useMempool() {
  const { address, activeNode } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    activeNode: selectActiveNodeApi(state),
  }));
  const mempoolFetcher = useCallback(() => new Api(activeNode.url).getMempoolTransactions(), [
    activeNode,
  ]);
  const { data: mempoolTxs } = useSWR('mempool', mempoolFetcher, { refreshInterval: 30_000 });
  if (mempoolTxs === undefined) return { inboundMempoolTxs: [] };
  const inboundMempoolTxs = filteredResults(mempoolTxs, address);
  return { inboundMempoolTxs };
}
