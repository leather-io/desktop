import { hexStringToECPair, ecPairToHexString, ecPairToAddress } from "blockstack";
import bigi from "bigi";
import numeral from "numeral";
import bip32 from 'bip32'
import bip39 from 'bip39'
import crypto from 'crypto'
import { b58ToC32, c32address, versions } from 'c32check'
import { ECPair } from "bitcoinjs-lib"
import { microToStacks, stacksToMicro } from "stacks-utils";
import BigNumber from "bignumber.js"

/**
 * Constants
 */
const SATOSHIS_IN_BTC = 100000000;
const MICROSTACKS_IN_STACKS = 1000000;

/**
 * Helpers
 */

/**
 * getPrivateKeyAddress
 * @param {string} network - the network
 * @param {string || object} privateKey
 */
const getPrivateKeyAddress = (network, privateKey) => {
  if (typeof privateKey === "string") {
    const ecKeyPair = hexStringToECPair(privateKey);
    return network.coerceAddress(ecPairToAddress(ecKeyPair));
  }
  return privateKey.address;
};

const mnemonicToPrivateKey = (mnemonic) => {
	const seed = bip39.mnemonicToSeed(mnemonic)

	const master = bip32.fromSeed(seed)
  const child = master.derivePath(`m/44'/5757'/0'/0/0`)

  const ecPair = ECPair.fromPrivateKey(child.privateKey)

  return ecPairToHexString(ecPair)
}

const mnemonicToStxAddress = (mnemonic) => {
  const seed = bip39.mnemonicToSeed(mnemonic)

	const master = bip32.fromSeed(seed)
	const child = master.derivePath(`m/44'/5757'/0'/0/0`)

	var SHA256 = crypto.createHash('SHA256')
	var RIPEMD160 = crypto.createHash('RIPEMD160')

	SHA256.update(child.publicKey)
	var pk256 = SHA256.digest()
	RIPEMD160.update(pk256)
	var pk160 = RIPEMD160.digest()

  const address = c32address(versions.mainnet.p2pkh,
                               pk160.slice(0, 20).toString('hex'))
	// const publicKey = child.publicKey.toString('hex')

	return address
}

const sumUTXOs = utxos => utxos.reduce((agg, x) => agg + x.value, 0);

const btcToSatoshis = amountInBtc =>
  amountInBtc ? Number(amountInBtc) * SATOSHIS_IN_BTC : 0;

const satoshisToBtc = amountInSatoshis =>
  amountInSatoshis ? Number(amountInSatoshis) / SATOSHIS_IN_BTC : 0;

const toBigInt = value =>
  bigi.fromByteArrayUnsigned(BigNumber(value).multipliedBy(1000000).toString())

const formatMicroStxValue = value => numeral(value).format("0.000000");

const emptySeedArray = (size) => {
  const seedArray = []
  for (var i = 0; i < size; i++) {
    seedArray.push('')
  }
  return seedArray
}

export {
  SATOSHIS_IN_BTC,
  MICROSTACKS_IN_STACKS,
  getPrivateKeyAddress,
  mnemonicToPrivateKey,
  mnemonicToStxAddress,
  sumUTXOs,
  microToStacks,
  stacksToMicro,
  btcToSatoshis,
  satoshisToBtc,
  toBigInt,
  formatMicroStxValue,
  emptySeedArray
};
