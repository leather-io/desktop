import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { selectAddress } from '@store/keys';
import { sumTxsTotalSpentByAddress } from '@utils/tx-utils';
import { selectAvailableBalance, selectLockedBalance, selectTotalBalance } from '@store/address';
import { stxBalanceValidator } from '@utils/validators/stx-balance-validator';
import { useMempool } from './use-mempool';

export function useBalance() {
  const { outboundMempoolTxs } = useMempool();
  const address = useSelector(selectAddress);
  const availableBalanceValue = useSelector(selectAvailableBalance);
  const totalBalanceValue = useSelector(selectTotalBalance);
  const lockedBalanceValue = useSelector(selectLockedBalance);

  const sumTotal = useMemo(
    () => sumTxsTotalSpentByAddress(outboundMempoolTxs, address || ''),
    [outboundMempoolTxs, address]
  );

  const totalBalance = useMemo(() => {
    const balance = new BigNumber(totalBalanceValue || 0).minus(sumTotal);
    if (balance.isLessThan(0)) return new BigNumber(0);
    return balance;
  }, [totalBalanceValue, sumTotal]);

  const availableBalance = useMemo(() => {
    const balance = new BigNumber(availableBalanceValue || 0).minus(sumTotal);
    if (balance.isLessThan(0)) return new BigNumber(0);
    return balance;
  }, [availableBalanceValue, sumTotal]);

  const availableBalanceValidator = useCallback(
    () => stxBalanceValidator(availableBalance),
    [availableBalance]
  );

  return {
    availableBalance,
    availableBalanceValidator,
    totalBalance,
    lockedBalance: lockedBalanceValue,
  };
}
