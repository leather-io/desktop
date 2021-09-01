import { useCallback } from 'react';
import BigNumber from 'bignumber.js';

import { useFeeRate } from './use-fee-rate';

/**
 * Returns a function calculating how much of a fee should be set
 * based on the number of bytes of the transaction.
 */
export function useCalculateFee() {
  const { feeRate } = useFeeRate();
  return useCallback((bytes: number) => new BigNumber(feeRate).multipliedBy(bytes), [feeRate]);
}
