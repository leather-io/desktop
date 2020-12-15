import { AddressHashMode } from '@stacks/transactions';
import BN from 'bn.js';
import { address } from 'bitcoinjs-lib';

const poxKeyToVersionBytesMap = {
  [AddressHashMode.SerializeP2PKH]: 0,
  [AddressHashMode.SerializeP2SH]: 5,
};

interface ConvertToPoxAddressBtc {
  version: Buffer;
  hashbytes: Buffer;
}
export function convertPoxAddressToBtc({ version, hashbytes }: ConvertToPoxAddressBtc) {
  const ver = new BN(version).toNumber();
  if (ver === AddressHashMode.SerializeP2WPKH || ver === AddressHashMode.SerializeP2WSH) return '';
  return address.toBase58Check(hashbytes, (poxKeyToVersionBytesMap as any)[ver]);
}
