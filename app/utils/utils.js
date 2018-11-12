import {
	hexStringToECPair,
	ecPairToAddress
} from 'blockstack'
import bigi from 'bigi'

export const SATOSHIS_IN_BTC = 100000000
export const MICROSTACKS_IN_STACKS = 1000000

export function getPrivateKeyAddress(network: Object, privateKey: string | TransactionSigner) 
  : string {
  if (typeof privateKey === 'string') {
    const ecKeyPair = hexStringToECPair(privateKey);
    return network.coerceAddress(ecPairToAddress(ecKeyPair));
  }
  else {
    return privateKey.address;
  }
}

export function sumUTXOs(utxos: Array<UTXO>) {
  return utxos.reduce((agg, x) => agg + x.value, 0);
}

export function microToStacks(microStacks: string) {
  if (!microStacks) {
    return 0
  }
  return Number(microStacks) * 1 / Math.pow(10,6)
}

export function stacksToMicro(stacks: string) {
  if (!stacks) {
    return 0
  }
  return Math.floor(Number(stacks) * MICROSTACKS_IN_STACKS)
}

export function btcToSatoshis(amountInBtc: string) {
  if (!amountInBtc) {
    return 0
  }
  return Number(amountInBtc) * SATOSHIS_IN_BTC
}

export function satoshisToBtc(amountInSatoshis: string) {
  if (!amountInSatoshis) {
    return 0
  }
  return 1.0 * Number(amountInSatoshis) / SATOSHIS_IN_BTC
}

// export function stacksToMicro(stacks: Object) {
//   const microStacksFactor = bigi.fromByteArrayUnsigned("1000000")
//   return stacks.multiply(microStacksFactor)
// }
