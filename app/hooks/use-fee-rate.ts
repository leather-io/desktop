import { FEE_RATE } from '@constants/index';
import { useMemo } from 'react';

export function useFeeRate() {
  return useMemo(() => ({ feeRate: FEE_RATE }), []);
}
