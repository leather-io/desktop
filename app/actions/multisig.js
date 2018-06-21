// @flow
// import type { counterStateType } from '../reducers/counter';
import btc from 'bitcoinjs-lib'

export function makeMultiSig(publicKeys: Array<string>, signaturesRequired: number) {
  if (signaturesRequired <= 0) {
    throw new Error('Signatures required must be >= 1')
  }
  if (signaturesRequired > publicKeys.length) {
    throw new Error('Signatures required must be <= the number of public keys')
  }

  const publicKeyBuffers = publicKeys.map(hex => Buffer.from(hex, 'hex'))
  const redeemScript = btc.script.multisig.output.encode(parseInt(signaturesRequired), pubKeys)
  const scriptPubKey = btc.script.scriptHash.output.encode(
    btc.crypto.hash160(redeemScript))
  const scriptHash = btc.script.compile(scriptPubKey).slice(2, 22)

  const address = btc.address.toBase58Check(scriptHash, 5)

  return { address, payload: redeemScript.toString('hex') }
}

