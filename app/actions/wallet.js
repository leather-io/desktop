// @flow
// import type { counterStateType } from '../reducers/counter';
import bip39 from 'bip39'
import bip32 from 'bip32'
import crypto from 'crypto'
import btc from 'bitcoinjs-lib'

type actionType = {
  +type: string
};

export const GENERATE_SEED = 'GENERATE_SEED';
export const UPDATE_SEED = 'UPDATE_SEED';

export function updateSeed(seed: string, address: string, publicKey: string) {
  return {
    type: UPDATE_SEED,
    seed,
    address,
    publicKey
  };
}

export function generateNewSeed() {
	const entropy = crypto.randomBytes(32)
	const seedPhrase = bip39.entropyToMnemonic(entropy)
	const seed = bip39.mnemonicToSeed(seedPhrase)

	const master = bip32.fromSeed(seed)
	const child = master.derivePath(`m/44'/5757'/0'/0/0`)

	var SHA256 = crypto.createHash('SHA256')
	var RIPEMD160 = crypto.createHash('RIPEMD160')

	SHA256.update(child.publicKey)
	var pk256 = SHA256.digest()
	RIPEMD160.update(pk256)
	var pk160 = RIPEMD160.digest()

	const address = btc.address.toBase58Check(pk160.slice(0, 20), 0)

	const publicKey = child.publicKey.toString('hex')

	return dispatch => {
		dispatch(updateSeed(seedPhrase, address, publicKey))
	}
}