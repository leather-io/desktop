import produce from "immer";
import { fetchStxAddressDetails } from "@common/lib";

const FETCH_ADDRESS_DATA_STARTED = "wallet/FETCH_ADDRESS_DATA_STARTED";
const FETCH_ADDRESS_DATA_FINISHED = "wallet/FETCH_ADDRESS_DATA_FINISHED";
const FETCH_ADDRESS_DATA_ERROR = "wallet/FETCH_ADDRESS_DATA_ERROR";

const ADD_WALLET_ADDRESS = "wallet/ADD_WALLET_ADDRESS";

export const WALLET_TYPES = {
  WATCH_ONLY: "wallet_types/WATCH_ONLY",
  LEDGER: "wallet_types/LEDGER",
  TREZOR: "wallet_types/TREZOR"
};

export const initialState = {
  address: null,
  type: null,
  data: null,
  loading: false,
  lastFetch: null,
  lastAttempt: null,
  error: null
};

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
 * @param {string} address - the wallet address
 * @param {string} type - the type of wallet
 */
const doAddWalletAddress = (address, type) => dispatch => {
  if (!address) {
    console.error("Please provide an address");
    return;
  }
  if (!type) {
    console.error("Please provide a wallet type");
    return;
  }
  return dispatch({
    type: ADD_WALLET_ADDRESS,
    payload: {
      address,
      type
    }
  });
};

/**
 * Our specific wallet type actions
 */
const doAddWatchOnlyAddress = address =>
  doAddWalletAddress(address, WALLET_TYPES.WATCH_ONLY);

const doAddTrezorAddress = address =>
  doAddWalletAddress(address, WALLET_TYPES.TREZOR);

const doAddLedgerAddress = address =>
  doAddWalletAddress(address, WALLET_TYPES.LEDGER);

const reducer = (state = initialState, { type, payload }) =>
  produce(state, draft => {
    switch (type) {
      case ADD_WALLET_ADDRESS:
        draft.address = payload.address;
        draft.type = payload.type;
        break;
      case FETCH_ADDRESS_DATA_STARTED:
        draft.loading = true;
        break;
      case FETCH_ADDRESS_DATA_FINISHED:
        draft.loading = false;
        draft.lastFetch = new Date();
        draft.lastAttempt = null;
        draft.data = payload;
        break;
      case FETCH_ADDRESS_DATA_ERROR:
        draft.loading = false;
        draft.error = payload;
        draft.lastAttempt = new Date();
        break;
    }
  });

export default reducer;



export {
  doFetchStxAddressData,
  doAddWalletAddress,
  doAddWatchOnlyAddress,
  doAddTrezorAddress,
  doAddLedgerAddress
};
