import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';

import { selectAddress } from '@store/keys';
import { useApi } from './use-api';
import { ApiResource } from '@models';

export function useMempool() {
  const api = useApi();
  const address = useSelector(selectAddress);

  const mempoolFetcher = useCallback(() => api.getMempoolTransactions(address || ''), [
    api,
    address,
  ]);
  const { data: mempoolTxs, refetch } = useQuery(ApiResource.Mempool, mempoolFetcher);

  const outboundMempoolTxs = mempoolTxs?.filter(tx => tx.sender_address === address);

  return {
    mempoolTxs: mempoolTxs ?? [],
    outboundMempoolTxs: outboundMempoolTxs ?? [],
    refetch,
  };
}
