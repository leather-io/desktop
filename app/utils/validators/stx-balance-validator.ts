import * as yup from 'yup';
import { stxToMicroStx } from '@utils/unit-convert';
import BigNumber from 'bignumber.js';

export function stxBalanceValidator(balance: BigNumber): yup.TestConfig {
  return {
    name: 'test-balance',
    message: 'Amount must be lower than balance',
    test: (value: any) => {
      if (value === null || value === undefined) return false;
      const enteredAmount = stxToMicroStx(value);
      return enteredAmount.isLessThanOrEqualTo(balance);
    },
  };
}
