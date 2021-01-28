import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { selectAvailableBalance } from '@store/address';
import { useCallback, useMemo } from 'react';
import { stxBalanceValidator } from '../utils/validators/stx-balance-validator';

export function useBalance() {
  const availableBalanceValue = useSelector(selectAvailableBalance);
  const availableBalance = useMemo(() => new BigNumber(availableBalanceValue || 0), [
    availableBalanceValue,
  ]);
  const availableBalanceValidator = useCallback(() => stxBalanceValidator(availableBalance), [
    availableBalance,
  ]);
  return {
    availableBalance,
    availableBalanceValidator,
  };
}
