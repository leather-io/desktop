import { network, transactions, config } from "blockstack";
import { c32address, c32ToB58, versions } from "c32check";
import Transport from "@ledgerhq/hw-transport-node-hid";
import btc from "bitcoinjs-lib";
import { sumUTXOs, toBigInt } from "@utils/utils";
import { TrezorSigner } from "@vendor/blockstack-trezor";
import { LedgerSigner } from "@vendor/blockstack-ledger";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import FormData from "form-data";
import { PATH } from "@common/constants";

export const ERRORS = {
  // not enough btc for fees
  INSUFFICIENT_BTC_BALANCE: {
    error: true,
    type: "INSUFFICIENT_BTC_BALANCE",
    message: "Insufficient Bitcoin balance to fund transaction fees."
  },
  // not enough stx to send
  INSUFFICIENT_STX_BALANCE: {
    error: true,
    type: "INSUFFICIENT_STX_BALANCE",
    message: "Insufficient Stacks balance."
  },
  // locked tokens error
  LOCKED_TOKENS: {
    error: true,
    type: "LOCKED_TOKENS",
    message:
      "Token transfer cannot be safely sent. Tokens have not been unlocked."
  },
  // generic error
  TRANSACTION_ERROR: {
    error: true,
    type: "TRANSACTION_ERROR",
    message: "Token transfer cannot be safely sent."
  }
};

/**
 * generateTransaction
 *
 * This will generate and sign our transaction with either a ledger or trezor
 *
 * @param {string} senderAddress - from Stacks address
 * @param {string} recipientAddress - to Stacks address
 * @param {object} amount - the amount of stacks to send
 * @param {string} walletType - one of WALLET_TYPES.TREZOR or WALLET_TYPES.LEDGER
 * @param {string} memo - the message for the tx
 */
const generateTransaction = async (
  senderAddress,
  recipientAddress,
  amount,
  walletType,
  memo = ""
) => {
  try {
    // generate our btc addresses for sender and recipient
    const senderBtcAddress = c32ToB58(senderAddress);
    console.log("senderBtcAddress", senderBtcAddress);
    const recipientBtcAddress = c32ToB58(recipientAddress);
    console.log("recipientBtcAddress", recipientBtcAddress);

    // define token type (always stacks)
    const tokenType = "STACKS";

    const tokenAmount = toBigInt(amount); // convert to bigi

    // define our signer
    const isLedger = walletType === WALLET_TYPES.LEDGER;
    const signer = isLedger
      ? new LedgerSigner(PATH, Transport)
      : new TrezorSigner(PATH, senderBtcAddress);

    // get an estimate
    const utxos = await config.network.getUTXOs(senderBtcAddress);
    const numUTXOs = utxos.length;
    console.log("numUTXOs", numUTXOs);

    const estimate = await transactions.estimateTokenTransfer(
      recipientBtcAddress,
      tokenType,
      tokenAmount,
      memo,
      numUTXOs
    );

    console.log("estimate", estimate);

    // current BTC balance
    const btcBalance = sumUTXOs(utxos);

    // account status
    const accountStatus = await config.network.getAccountStatus(
      senderBtcAddress,
      tokenType
    );
    // current STACKS balance
    const currentAccountBalance = await config.network.getAccountBalance(
      senderBtcAddress,
      tokenType
    );

    // current Block Height
    const blockHeight = await config.network.getBlockHeight();

    // check for our errors

    // not enough btc
    if (btcBalance < estimate) {
      return ERRORS.INSUFFICIENT_BTC_BALANCE;
    }
    // not enough stacks
    if (currentAccountBalance.compareTo(tokenAmount) < 0) {
      return ERRORS.INSUFFICIENT_STX_BALANCE;
    }

    // not enough tokens unlocked or no unlocked tokens
    if (accountStatus.lock_transfer_block_id > blockHeight) {
      return ERRORS.LOCKED_TOKENS;
    }

    // if we get here there are no errors
    return transactions.makeTokenTransfer(
      recipientBtcAddress,
      tokenType,
      tokenAmount,
      memo,
      signer
    );
  } catch (e) {
    console.log("ERROR", e);
    return ERRORS.TRANSACTION_ERROR;
  }
};

const postTransaction = async body =>
  fetch(`${config.network.btc.utxoProviderUrl}/pushtx?cors=true`, {
    method: "POST",
    body
  });

/**
 * broadcastTransaction
 *
 * This will broadcast our transaction
 * @param {string} rawTransaction - the raw tx
 */
const broadcastTransaction = async rawTransaction => {
  try {
    const form = new FormData();
    form.append("tx", rawTransaction);
    const response = await postTransaction(form);
    const text = await response.text();
    const success = text.toLowerCase().indexOf("transaction submitted") >= 0;
    if (success) {
      return btc.Transaction.fromHex(rawTransaction)
        .getHash()
        .reverse()
        .toString("hex"); // big_endian
    } else {
      return new RemoteServiceError(
        response,
        `Broadcast transaction failed with message: ${text}`
      );
    }
  } catch (e) {
    console.log(e);
  }
};

export { generateTransaction, broadcastTransaction };
