import { chain, ChainID } from './environment';

export function validateAddressChain(address: string) {
  const prefix = address.substr(0, 2);
  if (chain === ChainID.Testnet) {
    return prefix === 'SN' || prefix === 'ST';
  }
  if (chain === ChainID.Mainnet) {
    return prefix === 'SM' || prefix === 'SP';
  }
  return false;
}
