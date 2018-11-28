import bip32 from "bip32";
import crypto from "crypto";
import { network, transactions, config } from "blockstack";
import { c32address, c32ToB58, versions, b58ToC32 } from "c32check";
import TrezorConnect from "@vendor/trezor";
import { PATH } from "@common/constants";
import AppBtc from "@ledgerhq/hw-app-btc";
import Transport from "@ledgerhq/hw-transport-node-hid";
import bitcoin from "bitcoinjs-lib";

/**
 * Get address from child public key
 *
 * @param {number} child - the public key
 * @param {number} version_prefix - the mainnet version
 */
const getAddressFromChildPubKey = (child, version_prefix) => {
  if (child.length !== 33) {
    throw new Error("Invalid public key buffer length, expecting 33 bytes");
  }
  const SHA256 = crypto.createHash("SHA256");
  const RIPEMD160 = crypto.createHash("RIPEMD160");
  SHA256.update(child);
  const pk256 = SHA256.digest();
  RIPEMD160.update(pk256);
  const pk160 = RIPEMD160.digest();
  const prefix = version_prefix || versions.mainnet.p2pkh;
  return c32address(prefix, pk160.slice(0, 20).toString("hex"));
};

/**
 * getTrezorAddress
 *
 * Get public key from trezor and return BTC and STX addresses
 */
const getTrezorAddress = async () =>
  new Promise((resolve, reject) => {
    const generate = ({ success, xpubkey, error }) => {
      if (error) {
        if (error === "Window closed") {
          reject(
            new Error("The Trezor connect window was closed, please try again.")
          );
        } else {
          reject(new Error(error));
        }
      }
      if (success) {
        const { publicKey } = bip32.fromBase58(xpubkey);
        resolve(getAddressesFromPublicKey(publicKey));
      }
    };
    TrezorConnect.getXPubKey(PATH, generate);
  });
/**
 * getLedgerAddress
 * Get public key from ledger and return BTC and STX addresses
 */
const getLedgerAddress = async () => {
  try {
    const transport = await Transport.create();
    const appbtc = await new AppBtc(transport);
    const walletData = await appbtc.getWalletPublicKey(PATH);
    if (!walletData) return;
    const ecPair = bitcoin.ECPair.fromPublicKey(
      Buffer.from(walletData.publicKey, "hex")
    );
    return getAddressesFromPublicKey(ecPair.publicKey);
  } catch (e) {
    const error = "Failed to get address from Ledger";
    throw new Error(e.message || error);
  }
};

/**
 * getAddressesFromPublicKey
 */
const getAddressesFromPublicKey = publicKey => {
  const stx = getAddressFromChildPubKey(publicKey);
  const btc = c32ToB58(stx);
  return { stx, btc };
};

/**
 * convertStxAddressToBtcAddress
 */
const convertStxAddressToBtcAddress = stx => c32ToB58(stx);

/**
 * btcToStx
 */
const btcToStx = btc => b58ToC32(btc);

/**
 * fetchBtcAddressData
 *
 * TODO: for accounts with 50+ transactions, we'll have to paginate
 */
const fetchBtcAddressData = async btcAddress => {
  try {
    const response = await fetch(
      `https://api.blockcypher.com/v1/btc/main/addrs/${btcAddress}/full?includeHex=true&limit=50`
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
};

export {
  getTrezorAddress,
  getLedgerAddress,
  convertStxAddressToBtcAddress,
  fetchBtcAddressData,
  btcToStx
};
