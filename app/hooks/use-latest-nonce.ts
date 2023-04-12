/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useFetchPossibleNextNonce } from '@hooks/use-fetch-account-nonce';
import BigNumber from 'bignumber.js';

export function useLatestNonce() {
  const resp = useFetchPossibleNextNonce();

  if (!resp) return { nonce: 0 };

  return {
    nonce: new BigNumber(resp.nonce).toNumber(),
  };
}
