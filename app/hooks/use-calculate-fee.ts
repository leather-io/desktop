import { useCallback } from 'react';
import BigNumber from 'bignumber.js';

import { useFetchFeeRate } from './use-fetch-fee-rate';

const defaultFeeRate = 1;

/**
 * Returns a function calculating how much of a fee should be set
 * based on the number of bytes of the transaction.
 */
export function useCalculateFee() {
  const { feeRate } = useFetchFeeRate();
  return useCallback(
    (bytes: number) => new BigNumber(feeRate ?? defaultFeeRate).multipliedBy(bytes),
    [feeRate]
  );
}
