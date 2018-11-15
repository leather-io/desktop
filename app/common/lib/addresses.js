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
const getTrezorAddress = async () => {
  try {
    TrezorConnect.setCurrency("BTC");
    const generate = ({ success, xpubkey }) => {
      if (success) {
        const { publicKey } = bip32.fromBase58(xpubkey);
        return getAddressesFromPublicKey(publicKey);
      }
      throw new Error();
    };
    // return TrezorConnect.getXPubKey(PATH, generate)
    // for testing
    return generate({
      success: true,
      xpubkey:
        "xpub6E7aWWB9xun6EUDohxnp1Fd76jqvvT9RmDL8FGVYw92EAbn6V8f8poNuAqk5QkKAbktdxa1cquXr1LWqPtTpVj8FNz7SMzn8PC3xDHwn3EX"
    });
  } catch (e) {
    const error = "Failed to get address from Trezor";
    throw new Error(error);
  }
};
/**
 * Get public key from ledger and return BTC and STX addresses
 */
const getLedgerAddress = async () => {
  try {
    // const transport = await Transport.create();
    // const appbtc = await new AppBtc(transport);
    // const { publicKey } = await appbtc.getWalletPublicKey(PATH);
    const publicKey =
      "02309a8925c0963162c3e3035038817619d4c1edc1b462cc5d013da5e09e3a6813";
    const ecPair = bitcoin.ECPair.fromPublicKey(Buffer.from(publicKey, "hex"));
    return getAddressesFromPublicKey(ecPair.publicKey);
  } catch (e) {}
};

const getAddressesFromPublicKey = publicKey => {
  const stx = getAddressFromChildPubKey(publicKey);
  const btc = c32ToB58(stx);
  console.log("addresses", stx, btc);
  return { stx, btc };
};

const convertStxAddressToBtcAddress = stx => c32ToB58(stx);

export { getTrezorAddress, getLedgerAddress, convertStxAddressToBtcAddress };
