import * as yup from 'yup';
import { validateStacksAddress } from '../get-stx-transfer-direction';
import { validateAddressChain } from '../../crypto/validate-address-net';
import { NETWORK } from '@constants/index';

export function stxAddressSchema() {
  return yup
    .string()
    .defined('Must define a STX address')
    .test({
      name: 'address-validation',
      test(value: any) {
        if (!value) return false;
        const valid = validateStacksAddress(value);

        if (!valid) {
          return this.createError({ message: 'Input address is not a valid STX address' });
        }
        if (!validateAddressChain(value)) {
          return this.createError({ message: `Must use a ${NETWORK} STX address` });
        }
        return true;
      },
    });
}
