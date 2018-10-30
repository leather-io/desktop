import {
	hexStringToECPair,
	ecPairToAddress
} from 'blockstack'

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

export function microToStacks(microStacks) {
  return microStacks / 1 / Math.pow(10,6)
}