import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import useSWR from 'swr';

import { Api } from '@api/api';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { selectActiveNodeApi } from '@store/stacks-node';

export function useMempool() {
  const { address, activeNode } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    activeNode: selectActiveNodeApi(state),
  }));

  const mempoolFetcher = useCallback(
    () => new Api(activeNode.url).getMempoolTransactions(address || ''),
    [activeNode.url, address]
  );
  const { data: mempoolTxs } = useSWR('mempool', mempoolFetcher);

  const outboundMempoolTxs = mempoolTxs?.filter(tx => tx.sender_address === address);

  return {
    mempoolTxs: mempoolTxs ?? [],
    outboundMempoolTxs: outboundMempoolTxs ?? [],
  };
}
