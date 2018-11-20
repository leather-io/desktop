import bip32 from "bip32";
import crypto from "crypto";
import { network, transactions, config } from "blockstack";
import { c32address, c32ToB58, versions } from "c32check";
import TrezorConnect from "../../../trezor/trezor";
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

const getAddressesFromPublicKey = publicKey => {
  const stx = getAddressFromChildPubKey(publicKey);
  const btc = c32ToB58(stx);
  return { stx, btc };
};

const convertStxAddressToBtcAddress = stx => c32ToB58(stx);

export { getTrezorAddress, getLedgerAddress, convertStxAddressToBtcAddress };
