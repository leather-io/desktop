/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { stxToMicroStx } from '@utils/unit-convert';
import BigNumber from 'bignumber.js';
import * as yup from 'yup';

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
