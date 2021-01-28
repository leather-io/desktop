import { useCallback } from 'react';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';

import { useMempool } from '@hooks/use-mempool';
import { useApi } from '@hooks/use-api';

export function useLatestNonce() {
  const { address } = useSelector((state: RootState) => ({
    address: selectAddress(state),
  }));
  const api = useApi();
  const { outboundMempoolTxs } = useMempool();

  const nonceFetcher = useCallback(() => api.getNonce(address || ''), [api, address]);
  const { data } = useSWR('nonce', nonceFetcher);

  if (!data) return { nonce: 0 };

  return {
    nonce: BigNumber.max(
      data.nonce,
      ...outboundMempoolTxs.map(tx => new BigNumber(tx.nonce).plus(1))
    ).toNumber(),
  };
}
