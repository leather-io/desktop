import {
  FETCH_ADDRESS_DATA_STARTED,
  FETCH_ADDRESS_DATA_FINISHED,
  FETCH_ADDRESS_DATA_ERROR,
  FETCH_BALANCES_STARTED,
  FETCH_BALANCES_FINISHED,
  FETCH_BALANCES_ERROR,
  ADD_WALLET_ADDRESS,
  ADD_WALLET_ADDRESS_SUCCESS,
  ADD_WALLET_ADDRESS_ERROR,
  WALLET_RESET,
  WALLET_LOADING_STARTED,
  WALLET_LOADING_FINISHED,
  WALLET_TYPES,
  WALLET_SIGN_TRANSACTION_STARTED,
  WALLET_SIGN_TRANSACTION_FINISHED,
  WALLET_SIGN_TRANSACTION_ERROR,
  WALLET_BROADCAST_TRANSACTION_STARTED,
  WALLET_BROADCAST_TRANSACTION_FINISHED,
  WALLET_BROADCAST_TRANSACTION_ERROR,
  WALLET_CLEAR_ERROR
} from "@stores/reducers/wallet";
import { ERRORS } from "@common/lib/transactions";
import { fetchStxAddressDetails } from "@common/lib";
import { push } from "connected-react-router";
import { doNotify, doNotifyWarning } from "@stores/reducers/notifications";
import { fetchBtcBalance, fetchStxBalance } from "@common/lib/balances";
import { doPersistState } from "@stores/actions/app";
import { clearCache } from "@stores/persist/index";
import {
  getLedgerAddress,
  getTrezorAddress,
  convertStxAddressToBtcAddress,
  fetchBtcAddressData
} from "@common/lib/addresses";
import {
  selectWalletBitcoinAddress,
  selectWalletStacksAddress
} from "@stores/selectors/wallet";
import {
  generateTransaction,
  broadcastTransaction
} from "@common/lib/transactions";
import {
  TOGGLE_MODAL_KEEP_OPEN,
  TOGGLE_MODAL_CLOSE
} from "@stores/reducers/app";
import { decodeRawTx } from "@utils/stacks";
import { ROUTES } from "../../routes";

const doClearError = () => dispatch =>
  dispatch({
    type: WALLET_CLEAR_ERROR
  });

/**
 * Fetch our data for the Stacks Address
 * Address should already be validated before calling this function
 * @param {string} address - the stacks address we want data on
 */
const doFetchStxAddressData = address => async (dispatch, state) => {
  const btcAddress = selectWalletBitcoinAddress(state());
  try {
    dispatch({
      type: FETCH_ADDRESS_DATA_STARTED
    });
    const fetches = await Promise.all([
      fetchStxAddressDetails(address),
      fetchBtcAddressData(btcAddress)
    ]);
    if (!fetches) return null;
    const data = fetches[0];
    const btcData = fetches[1];
    const txs = btcData && btcData.txs && btcData.txs.length ? btcData.txs : [];

    // decode the raw tx to get at the stacks data
    const rawtxs = await Promise.all(
      txs.map(async tx => {
        if (!tx.hex) return;
        try {
          const transaction = await decodeRawTx(tx.hex, false);
          if (!transaction) return;
          if (transaction.opcode !== "$") {
            return;
          }
          return {
            ...transaction,
            fees: tx.fees,
            confirmations: tx.confirmations,
            block_height: tx.block_height,
            block_hash: tx.block_hash,
            inputs: tx.inputs,
            outputs: tx.outputs,
            time: tx.time,
            confirmed: tx.confirmed,
            received: tx.received,
            txid: tx.hash
          };
        } catch (e) {
          doNotifyWarning(e.message)(dispatch, state);
          console.log(e);
          return;
        }
      })
    );

    // - remove null items
    // - add pending state
    // - determine if invalid
    const rawTxs = rawtxs
      .filter(item => item) // remove null items
      .map(tx => ({
        ...tx,
        pending: Number(tx.confirmations) < 6, // blockstack core will either accept or deny a stx tx at 6+ confirmations from the bitcoin blockchain
        invalid:
          Number(tx.confirmations) >= 6 &&
          !data.history.find(historical => historical.txid === tx.txid) // if this is true, and is still displayed, it's an invalid stacks tx
      }));

    // merge the items from the historical api
    const transactions = rawTxs.map(thisTx => {
      const additionalData =
        data.history.find(
          historicalTx => historicalTx && historicalTx.txid === thisTx.txid
        ) || {};
      return {
        ...additionalData,
        ...thisTx
      };
    });
    dispatch({
      type: FETCH_ADDRESS_DATA_FINISHED,
      payload: {
        ...data,
        transactions
      }
    });
  } catch (e) {
    console.error("doFetchStxAddressData error: ", e.message);
    dispatch({
      type: FETCH_ADDRESS_DATA_ERROR,
      payload: e.message
    });
  }
};

/**
 * Add our address
 *
 * @param {string} addresses - the wallet addresses (btc, stx)
 * @param {string} type - the type of wallet
 */
const doAddWalletAddress = (addresses, type) => dispatch => {
  console.log("add address");
  if (!addresses) {
    console.error("Please provide addresses");
    return;
  }
  if (!type) {
    console.error("Please provide a wallet type");
    return;
  }
  dispatch({
    type: ADD_WALLET_ADDRESS,
    payload: {
      addresses,
      type
    }
  });
  doPersistState()(dispatch);
};

/**
 * Add a watch only wallet address
 */
const doAddWatchOnlyAddress = address =>
  doAddWalletAddress(
    { stx: address, btc: convertStxAddressToBtcAddress(address) },
    WALLET_TYPES.WATCH_ONLY
  );

/**
 * Add a Trezor address
 */
const doAddTrezorAddress = addresses => dispatch =>
  doAddWalletAddress(addresses, WALLET_TYPES.TREZOR)(dispatch);

/**
 * Add a Ledger address
 */
const doAddLedgerAddress = addresses => dispatch =>
  doAddWalletAddress(addresses, WALLET_TYPES.LEDGER)(dispatch);

/**
 * Reset our app
 */
const doResetWallet = () => async dispatch => {
  dispatch({
    type: WALLET_RESET
  });
  dispatch(push(ROUTES.TERMS));
  await clearCache();
  doNotify("Wallet has been reset!")(dispatch);
};

const doAddHardwareWallet = type => async (dispatch, state) => {
  // define our wallet fn
  const walletFn =
    type === WALLET_TYPES.LEDGER ? getLedgerAddress : getTrezorAddress;

  dispatch({
    type: WALLET_LOADING_STARTED
  });

  try {
    const addresses = await walletFn();
    if (addresses) {
      dispatch({
        type: ADD_WALLET_ADDRESS,
        payload: {
          addresses,
          type
        }
      });
      dispatch({
        type: WALLET_LOADING_FINISHED
      });
      doNotify({
        title: "Success!",
        message: "Hardware wallet successfully synced!"
      })(dispatch);
      dispatch(push("/dashboard"));
      doFetchBalances(addresses)(dispatch, state);
      doFetchStxAddressData(addresses.stx)(dispatch, state);
    }
  } catch (e) {
    let message = e.message;
    if (
      e &&
      e.message &&
      e.message.includes(`cannot open device with path`) &&
      type === WALLET_TYPES.LEDGER
    ) {
      message =
        "Could not connect to device. Try closing the BTC app and reopening it.";
    }
    dispatch({
      type: WALLET_LOADING_FINISHED
    });
    dispatch({
      type: ADD_WALLET_ADDRESS_ERROR,
      payload: message
    });
    doNotifyWarning({
      type: "error",
      title: "Whoops!",
      message: message
    })(dispatch);
  }
};

const doFetchBalances = addresses => async (dispatch, state) => {
  let btc = addresses.btc;
  let stx = addresses.stx;
  if (!addresses) {
    btc = selectWalletBitcoinAddress(state);
    stx = selectWalletStacksAddress(state);
    if (!btc) {
      console.error("no btc address");
      return;
    }
    if (!stx) {
      console.error("no stx address");
      return;
    }
  }
  dispatch({
    type: FETCH_BALANCES_STARTED
  });
  try {
    const btcBalance = await fetchBtcBalance(btc);
    const stxBalance = await fetchStxBalance(stx);

    const balances = [
      {
        type: "btc",
        balance: btcBalance
      },
      {
        type: "stx",
        balance: stxBalance
      }
    ];

    dispatch({
      type: FETCH_BALANCES_FINISHED,
      payload: balances
    });
  } catch (e) {
    dispatch({
      type: FETCH_BALANCES_ERROR,
      payload: e.message
    });
  }
};

const doRefreshData = (notify = true) => (dispatch, state) => {
  const stx = selectWalletStacksAddress(state());
  const btc = selectWalletBitcoinAddress(state());
  notify && doNotify("Refreshing data!")(dispatch);
  doFetchBalances({ stx, btc })(dispatch);
  doFetchStxAddressData(stx)(dispatch, state);
};

const doAllowModalToClose = () => dispatch =>
  dispatch({
    type: TOGGLE_MODAL_CLOSE
  });
const doNotAllowModalToClose = () => dispatch =>
  dispatch({
    type: TOGGLE_MODAL_KEEP_OPEN
  });

/**
 * doSignTransaction
 *
 * This takes input from the send modal, and then signs a tx with whichever hardware device the user has -- ledger or trezor.
 *
 * @param {string} senderAddress - the user's STX address
 * @param {string} recipientAddress - the STX address they want to send to
 * @param {string} amountToSend - the STX amount (not microstacks)
 * @param {string} walletType - WALLET_TYPES.LEDGER || WALLET_TYPES.TREZOR
 * @param {string} memo - an optional message (scriptData)
 */
const doSignTransaction = (
  senderAddress,
  recipientAddress,
  amountToSend,
  walletType,
  memo
) => async (dispatch, state) => {
  // refresh data, false to prevent a notification
  doRefreshData(false)(dispatch, state);
  // prevent the modal from being closed
  doNotAllowModalToClose()(dispatch);
  // start our process
  dispatch({
    type: WALLET_SIGN_TRANSACTION_STARTED
  });

  try {
    const transaction = await generateTransaction(
      senderAddress,
      recipientAddress,
      amountToSend,
      walletType,
      memo
    );

    // if we have an error
    if (transaction.error) {
      // dispatch error
      dispatch({
        type: WALLET_SIGN_TRANSACTION_ERROR,
        payload: transaction
      });
      // allow the modal to be closed if error
      doAllowModalToClose()(dispatch);

      // notification
      doNotify({
        type: "error",
        message: transaction.message
      });
      return transaction;
    } else {
      // allow the modal to be closed if error
      doAllowModalToClose()(dispatch);
      doRefreshData(false)(dispatch, state);
      // success
      dispatch({
        type: WALLET_SIGN_TRANSACTION_FINISHED,
        payload: transaction
      });
      return transaction;
    }
  } catch (e) {
    if (typeof e === "string") {
      doNotifyWarning({
        title: "Transaction Signing Failed",
        message: e
      })(dispatch);
      // allow the modal to be closed
      doAllowModalToClose()(dispatch);
      dispatch({
        type: WALLET_SIGN_TRANSACTION_ERROR,
        payload: e
      });
    }
    if (
      e.type === ERRORS.INSUFFICIENT_BTC_BALANCE.type ||
      e.message.includes("Not enough UTXOs to fund. Left to fund: ")
    ) {
      // allow the modal to be closed in case of error
      doAllowModalToClose()(dispatch);
      doNotifyWarning({
        title: "Not enough BTC",
        message:
          "Looks like you don't have enough BTC to pay the associated transaction fees for this transaction."
      })(dispatch);
      return;
    }
    doNotifyWarning({
      title: "Something went wrong.",
      message: e.message
    })(dispatch);
    // allow the modal to be closed in case of error
    doAllowModalToClose()(dispatch);
    dispatch({
      type: WALLET_SIGN_TRANSACTION_ERROR,
      payload: e.message
    });
  }
};

const doBroadcastTransaction = rawTx => async (dispatch, state) => {
  try {
    // start our process
    dispatch({
      type: WALLET_BROADCAST_TRANSACTION_STARTED
    });
    const txHash = await broadcastTransaction(rawTx);
    dispatch({
      type: WALLET_BROADCAST_TRANSACTION_FINISHED,
      payload: txHash
    });
    doRefreshData(false)(dispatch, state);
    doNotify({
      title: "Success!",
      message: "Your transaction has been submitted!"
    })(dispatch);
    return txHash;
  } catch (e) {
    doNotifyWarning({
      title: "Something went wrong.",
      message: e.message
    })(dispatch);
    dispatch({
      type: WALLET_BROADCAST_TRANSACTION_ERROR,
      payload: e.message
    });
  }
};

export {
  doClearError,
  doFetchStxAddressData,
  doAddWalletAddress,
  doAddWatchOnlyAddress,
  doAddTrezorAddress,
  doAddLedgerAddress,
  doResetWallet,
  doAddHardwareWallet,
  doFetchBalances,
  doRefreshData,
  doSignTransaction,
  doBroadcastTransaction
};
