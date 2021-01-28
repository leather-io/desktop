import { validateStacksAddress } from '../get-stx-transfer-direction';
import { validateAddressChain } from '../../crypto/validate-address-net';
import { NETWORK } from '@constants/index';

export function stxAddressValidator(stxAddress: string) {
  if (!stxAddress) return { stxAddress: 'Must define a STX address' };
  const valid = validateStacksAddress(stxAddress);
  if (!valid) {
    return { stxAddress: 'Input address is not a valid STX address' };
  }
  if (!validateAddressChain(stxAddress)) {
    return { stxAddress: `Must use a ${NETWORK} STX address` };
  }
  return {};
}
