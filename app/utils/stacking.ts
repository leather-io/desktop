import { NETWORK } from '@constants/index';
import { poxAddressToBtcAddress } from '@stacks/stacking';

interface ConvertToPoxAddressBtc {
  version: Uint8Array;
  hashbytes: Uint8Array;
}
export function convertPoxAddressToBtc(network: 'mainnet' | 'testnet') {
  return ({ version, hashbytes }: ConvertToPoxAddressBtc) => {
    return poxAddressToBtcAddress(version[0], hashbytes, network);
  };
}

export const formatPoxAddressToNetwork = convertPoxAddressToBtc(NETWORK);

export function formatCycles(cycles: number) {
  return `${cycles} cycle${cycles !== 1 ? 's' : ''}`;
}
