import { deriveStxAddressChain } from '@blockstack/keychain';
import { chain } from './environment';

export const deriveStxAddressKeychain = deriveStxAddressChain(chain);
