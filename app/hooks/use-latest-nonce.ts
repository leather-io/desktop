import BigNumber from 'bignumber.js';

import { useFetchPossibleNextNonce } from '@hooks/use-fetch-account-nonce';

export function useLatestNonce() {
  const resp = useFetchPossibleNextNonce();

  if (!resp) return { nonce: 0 };

  return {
    nonce: new BigNumber(resp.nonce).toNumber(),
  };
}
