import BigNumber from 'bignumber.js';

import { useMempool } from '@hooks/use-mempool';
import { useFetchAccountNonce } from '@hooks/use-fetch-account-nonce';

export function useLatestNonce() {
  const { outboundMempoolTxs } = useMempool();

  const { nonce } = useFetchAccountNonce();

  if (!nonce) return { nonce: 0 };

  return {
    nonce: BigNumber.max(
      nonce,
      ...outboundMempoolTxs.map(tx => new BigNumber(tx.nonce).plus(1))
    ).toNumber(),
  };
}
