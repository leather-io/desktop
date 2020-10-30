import { hexStringToECPair, ecPairToHexString, ecPairToAddress } from "blockstack";
import bigi from "bigi";
import numeral from "numeral";
import bip32 from 'bip32'
import bip39 from 'bip39'
import { b58ToC32, c32address, versions } from 'c32check'
import { ECPair } from "bitcoinjs-lib"
import { microToStacks, stacksToMicro } from "@blockstack/stacks-utils";
import BigNumber from "bignumber.js"
import { PATH } from "@common/constants";

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
  const child = master.derivePath(PATH)

  const ecPair = ECPair.fromPrivateKey(child.privateKey)

  return ecPairToHexString(ecPair)
}

const mnemonicToStxAddress = (mnemonic) => {
  const seed = bip39.mnemonicToSeed(mnemonic)

	const master = bip32.fromSeed(seed)
	const child = master.derivePath(PATH)

  const address = b58ToC32(ecPairToAddress(ECPair.fromPrivateKey(child.privateKey)))
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
