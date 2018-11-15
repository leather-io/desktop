import {
  FETCH_ADDRESS_DATA_STARTED,
  FETCH_ADDRESS_DATA_FINISHED,
  FETCH_ADDRESS_DATA_ERROR,
  FETCH_BALANCES_STARTED,
  FETCH_BALANCES_FINISHED,
  FETCH_BALANCES_ERROR,
  ADD_WALLET_ADDRESS,
  WALLET_RESET,
  WALLET_LOADING_STARTED,
  WALLET_LOADING_FINISHED,
  WALLET_TYPES
} from "@stores/reducers/wallet";
import { fetchStxAddressDetails } from "@common/lib";
import { push } from "connected-react-router";
import { doNotify } from "@stores/reducers/notifications";
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
  // start loading
  dispatch({
    type: WALLET_LOADING_STARTED
  });
  dispatch(push("/dashboard"));
  doNotify("Syncing address data!")(dispatch);
  // define our wallet fn
  const walletFn =
    type === WALLET_TYPES.LEDGER ? getLedgerAddress : getTrezorAddress;

  try {
    const addresses = await walletFn();
    dispatch({
      type: ADD_WALLET_ADDRESS,
      payload: {
        addresses,
        type
      }
    });
    doFetchBalances(addresses)(dispatch, state);
    doFetchStxAddressData(addresses.stx)(dispatch, state);
  } catch (e) {}
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

export {
  doFetchStxAddressData,
  doAddWalletAddress,
  doAddWatchOnlyAddress,
  doAddTrezorAddress,
  doAddLedgerAddress,
  doResetWallet,
  doAddHardwareWallet,
  doFetchBalances
};
