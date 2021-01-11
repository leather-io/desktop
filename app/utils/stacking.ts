import { AddressHashMode } from '@stacks/transactions';
import BN from 'bn.js';
import { address } from 'bitcoinjs-lib';

import { NETWORK } from '@constants/index';

const poxKeyToVersionBytesMap: Record<'mainnet' | 'testnet', any> = {
  mainnet: {
    [AddressHashMode.SerializeP2PKH]: 0x00,
    [AddressHashMode.SerializeP2SH]: 0x05,
  },
  testnet: {
    [AddressHashMode.SerializeP2PKH]: 0x6f,
    [AddressHashMode.SerializeP2SH]: 0xc4,
  },
};

interface ConvertToPoxAddressBtc {
  version: Buffer;
  hashbytes: Buffer;
}
export function convertPoxAddressToBtc(network: 'mainnet' | 'testnet') {
  return ({ version, hashbytes }: ConvertToPoxAddressBtc) => {
    const ver = new BN(version).toNumber() as AddressHashMode;
    if (ver === AddressHashMode.SerializeP2WPKH || ver === AddressHashMode.SerializeP2WSH)
      return null;
    return address.toBase58Check(hashbytes, poxKeyToVersionBytesMap[network][ver]);
  };
}

export const formatPoxAddressToNetwork = convertPoxAddressToBtc(NETWORK);
