import {
  FETCH_ADDRESS_DATA_STARTED,
  FETCH_ADDRESS_DATA_FINISHED,
  FETCH_ADDRESS_DATA_ERROR,
  FETCH_BALANCES_STARTED,
  FETCH_BALANCES_FINISHED,
  FETCH_BALANCES_ERROR,
  TEMP_SAVE_SEED,
  ERASE_SEED,
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
import {
  APP_UPDATE_REQUIRED,
  APP_UPDATE_NOT_REQUIRED
} from "@stores/reducers/app";
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
import { ROUTES, CORE_NODE_URI, STACKS_BLOCKCHAIN_VERSION } from "@common/constants";
import { fetchStacksAddressData } from "stacks-utils";
import { mnemonicToStxAddress, mnemonicToPrivateKey } from '@utils/utils'
import crypto from 'crypto'
import bip39 from 'bip39'
import semver from 'semver'

const doClearError = () => dispatch =>
  dispatch({
    type: WALLET_CLEAR_ERROR
  });

/**
 * Generate a new seed phrase
 */
const doGenerateNewSeed = () => async dispatch => {
  const entropy = crypto.randomBytes(32)
  const seedPhrase = bip39.entropyToMnemonic(entropy)
  
  const address = mnemonicToStxAddress(seedPhrase)
  const publicKey = ""

  dispatch({
    type: TEMP_SAVE_SEED,
    payload:  { 
      seed: seedPhrase,
      address: {
        stx: address,
        btc: convertStxAddressToBtcAddress(address)
      },
      publicKey: publicKey
    }
  })
}

/** 
 * Clear seed from redux state
 */ 
const doClearSeed = () => dispatch =>
  dispatch({
    type: ERASE_SEED
  });

/**
 * Fetch our data for the Stacks address
 * Address should already be validated before calling this function
 * @param {string} address - the stacks address we want data on
 */
const doFetchStxAddressData = address => async dispatch => {
  try {
    dispatch({
      type: FETCH_ADDRESS_DATA_STARTED
    });
    const data = await fetchStacksAddressData(address);
    dispatch({
      type: FETCH_ADDRESS_DATA_FINISHED,
      payload: data
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
 * Add a software wallet address
 */
const doAddSoftwareWalletAddress = address =>
  doAddWalletAddress(
    { stx: address, btc: convertStxAddressToBtcAddress(address) },
    WALLET_TYPES.SOFTWARE
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

/**
 * doAddHardwareWallet
 *
 * @param {String} type - one of WALLET_TYPES.LEDGER || WALLET_TYPES.TREZOR
 */
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
      doRefreshData(false)(dispatch, state);
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
  let stx = addresses.stx;
  if (!addresses) {
    stx = selectWalletStacksAddress(state());

    if (!stx) {
      console.error("no stx address");
      return;
    }
  }
  dispatch({
    type: FETCH_BALANCES_STARTED
  });
  try {
    const promises = await Promise.all([fetchStxBalance(stx)]);
    const balances = [
      {
        type: "stx",
        balance: promises[0]
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
  doFetchBalances({ stx, btc })(dispatch, state);
  doFetchStxAddressData(stx)(dispatch, state);
  doCompatibilityCheck()(dispatch, state);
};

/**
 * doAllowModalToClose
 */
const doAllowModalToClose = () => dispatch =>
  dispatch({
    type: TOGGLE_MODAL_CLOSE
  });

/**
 * doNotAllowModalToClose
 */
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
 * @param {string} walletType - WALLET_TYPES.SOFTWARE || WALLET_TYPES.LEDGER || WALLET_TYPES.TREZOR
 * @param {string} seedPhrase - the seed phrase that will be used to sign the transaction
 * @param {string} memo - an optional message (scriptData)
 */
const doSignTransaction = (
  senderAddress,
  recipientAddress,
  amountToSend,
  walletType,
  seedPhrase,
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
    const privateKey = ""

    if (walletType === WALLET_TYPES.SOFTWARE) {
      privateKey = mnemonicToPrivateKey(seedPhrase)
    }

    const transaction = await generateTransaction(
      senderAddress,
      recipientAddress,
      amountToSend,
      walletType,
      privateKey,
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
          "Looks like you don't have enough BTC to pay the fee for this transaction."
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
    // prevent transaction broadcast if app update is required
    if (state().app.updateRequired) {
      doNotifyWarning({
        title: "Error sending transaction",
        message: "Your wallet software needs to be updated in order to send transactions."
      })(dispatch);
      dispatch({
        type: WALLET_BROADCAST_TRANSACTION_ERROR,
        payload: "App update is required."
      });
      return null
    }

    dispatch({
      type: WALLET_BROADCAST_TRANSACTION_STARTED
    });

    const txHash = await broadcastTransaction(rawTx);

    dispatch({
      type: WALLET_BROADCAST_TRANSACTION_FINISHED,
      payload: txHash
    });
    doRefreshData(false)(dispatch, state);
    // Set a delayed refresh action in case data pulled from API isn't up to date
    setTimeout(() => (doRefreshData(false)(dispatch, state)), 2500)
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

const doCompatibilityCheck = () => async (dispatch, state) => {
  try {
    const coreNodeInfoURI = `${CORE_NODE_URI}/v1/info`;
    const res = await fetch(coreNodeInfoURI);
    const info = await res.json();
    
    if (info.blockchain_version) {
      if (semver.eq(semver.coerce(STACKS_BLOCKCHAIN_VERSION), 
                    semver.coerce(info.blockchain_version))
        ) {
        dispatch({ type: APP_UPDATE_NOT_REQUIRED });
      } else {
        dispatch({ type: APP_UPDATE_REQUIRED });
      }
    } else {
      dispatch({ type: APP_UPDATE_NOT_REQUIRED });
    }
  } catch (e) {
    console.log('error')
    console.log(e)
  } 
}

export {
  doClearError,
  doGenerateNewSeed,
  doClearSeed,
  doFetchStxAddressData,
  doAddWalletAddress,
  doAddWatchOnlyAddress,
  doAddSoftwareWalletAddress,
  doAddTrezorAddress,
  doAddLedgerAddress,
  doResetWallet,
  doAddHardwareWallet,
  doFetchBalances,
  doRefreshData,
  doCompatibilityCheck,
  doSignTransaction,
  doBroadcastTransaction,
};
