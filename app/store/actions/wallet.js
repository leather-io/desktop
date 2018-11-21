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
import {
  getLedgerAddress,
  getTrezorAddress,
  convertStxAddressToBtcAddress
} from "@common/lib/addresses";
import {
  selectWalletBitcoinAddress,
  selectWalletStacksAddress
} from "@stores/selectors/wallet";
import {
  generateTransaction,
  broadcastTransaction
} from "@common/lib/transactions";
import { TOGGLE_MODAL } from "@stores/reducers/app";

const doClearError = () => dispatch =>
  dispatch({
    type: WALLET_CLEAR_ERROR
  });

/**
 * Fetch our data for the Stacks Address
 * Address should already be validated before calling this function
 * @param {string} address - the stacks address we want data on
 */
const doFetchStxAddressData = address => async dispatch => {
  try {
    dispatch({
      type: FETCH_ADDRESS_DATA_STARTED
    });
    const data = await fetchStxAddressDetails(address);
    dispatch({
      type: FETCH_ADDRESS_DATA_FINISHED,
      payload: data
    });
  } catch (e) {
    console.log("error!", e.message);
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
  return dispatch({
    type: ADD_WALLET_ADDRESS,
    payload: {
      addresses,
      type
    }
  });
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
const doResetWallet = () => dispatch => {
  dispatch({
    type: WALLET_RESET
  });
  dispatch(push("/"));
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
        message: "Trezor successfully synced. Fetching data..."
      })(dispatch);
      dispatch(push("/dashboard"));
      doFetchBalances(addresses)(dispatch, state);
      doFetchStxAddressData(addresses.stx)(dispatch, state);
    }
  } catch (e) {
    dispatch({
      type: WALLET_LOADING_FINISHED
    });
    dispatch({
      type: ADD_WALLET_ADDRESS_ERROR,
      payload: e.message
    });
    doNotifyWarning({
      type: "error",
      title: "Whoops!",
      message: e.message
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
  console.log("state", state());
  const stx = selectWalletStacksAddress(state());
  const btc = selectWalletBitcoinAddress(state());
  notify && doNotify("Refreshing data...")(dispatch);
  doFetchBalances({ stx, btc })(dispatch);
  doFetchStxAddressData(stx)(dispatch);
};

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
  dispatch({
    type: TOGGLE_MODAL
  });
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
      dispatch({
        type: TOGGLE_MODAL
      });
      // notification
      doNotify({
        type: "error",
        message: transaction.message
      });
      return transaction;
    } else {
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
      dispatch({
        type: TOGGLE_MODAL
      });
      dispatch({
        type: WALLET_SIGN_TRANSACTION_ERROR,
        payload: e
      });
    }
    if (e.type === ERRORS.INSUFFICIENT_BTC_BALANCE.type) {
      // allow the modal to be closed in case of error
      dispatch({
        type: TOGGLE_MODAL
      });
      doNotifyWarning({
        title: "Not enough BTC",
        message:
          "Looks like you don't have enough BTC to pay the associated transaction fees for this transaction."
      })(dispatch);
      return;
    }
    // allow the modal to be closed in case of error
    dispatch({
      type: TOGGLE_MODAL
    });
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
    const tx = await broadcastTransaction(rawTx);
    dispatch({
      type: WALLET_BROADCAST_TRANSACTION_FINISHED,
      payload: tx
    });
  } catch (e) {
    dispatch({
      type: WALLET_BROADCAST_TRANSACTION_ERROR,
      payload: e.message
    });
  }
};

// const doBroadcastTransaction = () => null;
// const doSignTransaction = () => null;

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
