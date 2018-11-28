import { hexStringToECPair, ecPairToAddress } from "blockstack";
import bigi from "bigi";
import numeral from "numeral";

import { microToStacks, stacksToMicro } from "stacks-utils";
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

const sumUTXOs = utxos => utxos.reduce((agg, x) => agg + x.value, 0);

const btcToSatoshis = amountInBtc =>
  amountInBtc ? Number(amountInBtc) * SATOSHIS_IN_BTC : 0;

const satoshisToBtc = amountInSatoshis =>
  amountInSatoshis ? Number(amountInSatoshis) / SATOSHIS_IN_BTC : 0;

const toBigInt = value =>
  Number(value) < 1
    ? bigi.valueOf(Number(value) * 1000000)
    : bigi.fromByteArrayUnsigned(value).multiply(bigi.valueOf(1000000));

const formatMicroStxValue = value => numeral(value).format("0.000000");

export {
  SATOSHIS_IN_BTC,
  MICROSTACKS_IN_STACKS,
  getPrivateKeyAddress,
  sumUTXOs,
  microToStacks,
  stacksToMicro,
  btcToSatoshis,
  satoshisToBtc,
  toBigInt,
  formatMicroStxValue
};
