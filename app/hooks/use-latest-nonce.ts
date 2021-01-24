import { useCallback } from 'react';
import useSWR from 'swr';
import { useSelector } from 'react-redux';

import { Api } from '@api/api';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { selectActiveNodeApi } from '@store/stacks-node';
import { useMempool } from '@hooks/use-mempool';
import BigNumber from 'bignumber.js';

export function useLatestNonce() {
  const { address, activeNode } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    activeNode: selectActiveNodeApi(state),
  }));
  const { outboundMempoolTxs } = useMempool();

  const nonceFetcher = useCallback(() => new Api(activeNode.url).getNonce(address || ''), [
    activeNode.url,
    address,
  ]);
  const { data } = useSWR('nonce', nonceFetcher);

  if (!data) return { nonce: 0 };

  return {
    nonce: new BigNumber(data.nonce).plus(outboundMempoolTxs.length).toNumber(),
  };
}
