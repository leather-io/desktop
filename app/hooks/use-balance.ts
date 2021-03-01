import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { selectAddress } from '@store/keys';
import { sumTxsTotalSpentByAddress } from '@utils/tx-utils';
import { selectAvailableBalance } from '@store/address';
import { stxBalanceValidator } from '@utils/validators/stx-balance-validator';
import { useMempool } from './use-mempool';

export function useBalance() {
  const { outboundMempoolTxs } = useMempool();
  const address = useSelector(selectAddress);
  const availableBalanceValue = useSelector(selectAvailableBalance);

  const sumTotal = useMemo(() => sumTxsTotalSpentByAddress(outboundMempoolTxs, address || ''), [
    outboundMempoolTxs,
    address,
  ]);

  const availableBalance = useMemo(
    () => new BigNumber(availableBalanceValue || 0).minus(sumTotal),
    [availableBalanceValue, sumTotal]
  );

  const availableBalanceValidator = useCallback(() => stxBalanceValidator(availableBalance), [
    availableBalance,
  ]);
  return {
    availableBalance,
    availableBalanceValidator,
  };
}
