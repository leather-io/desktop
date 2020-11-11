import { deriveStxAddressChain } from '@stacks/keychain';
import { chain } from '../environment';

export const deriveStxAddressKeychain = deriveStxAddressChain(chain);
