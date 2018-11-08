import {
	hexStringToECPair,
	ecPairToAddress
} from 'blockstack'
import bigi from 'bigi'

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
  return Math.floor(Number(stacks) * 1000000)
}

// export function stacksToMicro(stacks: Object) {
//   const microStacksFactor = bigi.fromByteArrayUnsigned("1000000")
//   return stacks.multiply(microStacksFactor)
// }
