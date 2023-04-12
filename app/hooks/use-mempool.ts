/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useApi } from './use-api';
import { ApiResource } from '@models';
import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { selectAddress } from '@store/keys';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

interface UseMempool {
  mempoolTxs: MempoolTransaction[];
  outboundMempoolTxs: MempoolTransaction[];
  refetch(): Promise<any>;
}
export function useMempool(): UseMempool {
  const api = useApi();
  const address = useSelector(selectAddress);

  const mempoolFetcher = useCallback(
    ({ queryKey }) => {
      const [, walletAddress] = queryKey;
      if (!walletAddress) return;
      return api.getMempoolTransactions(walletAddress);
    },
    [api]
  );
  const { data: mempoolTxs = [], refetch } = useQuery(
    [ApiResource.Mempool, address],
    mempoolFetcher
  );

  const outboundMempoolTxs = mempoolTxs.filter(tx => tx.sender_address === address);

  const pendingMempoolTxs = mempoolTxs.filter(tx => tx.tx_status === 'pending');

  return { mempoolTxs: pendingMempoolTxs, outboundMempoolTxs, refetch };
}
