import BigNumber from 'bignumber.js';

import { useMempool } from '@hooks/use-mempool';
import { useFetchAccountNonce } from '@hooks/use-fetch-account-nonce';

export function useLatestNonce() {
  const { outboundMempoolTxs } = useMempool();

  const resp = useFetchAccountNonce();

  if (!resp) return { nonce: 0 };

  return {
    nonce: BigNumber.max(
      resp.nonce,
      ...outboundMempoolTxs.map(tx => new BigNumber(tx.nonce).plus(1))
    ).toNumber(),
  };
}
