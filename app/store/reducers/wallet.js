import produce from "immer";

const FETCH_ADDRESS_DATA_STARTED = "wallet/FETCH_ADDRESS_DATA_STARTED";
const FETCH_ADDRESS_DATA_FINISHED = "wallet/FETCH_ADDRESS_DATA_FINISHED";
const FETCH_ADDRESS_DATA_ERROR = "wallet/FETCH_ADDRESS_DATA_ERROR";

const FETCH_BALANCES_STARTED = "wallet/FETCH_BALANCES_STARTED";
const FETCH_BALANCES_FINISHED = "wallet/FETCH_BALANCES_FINISHED";
const FETCH_BALANCES_ERROR = "wallet/FETCH_BALANCES_ERROR";

const ADD_WALLET_ADDRESS = "wallet/ADD_WALLET_ADDRESS";

const WALLET_RESET = "wallet/WALLET_RESET";

const WALLET_LOADING_STARTED = "wallet/WALLET_LOADING_STARTED";
const WALLET_LOADING_FINISHED = "wallet/WALLET_LOADING_FINISHED";

const WALLET_TYPES = {
  WATCH_ONLY: "wallet_types/WATCH_ONLY",
  LEDGER: "wallet_types/LEDGER",
  TREZOR: "wallet_types/TREZOR"
};

export const initialState = {
  addresses: {
    stx: null,
    btc: null
  },
  balances: {
    stx: null,
    btc: null
  },
  type: null,
  data: null,
  loading: false,
  lastFetch: null,
  lastAttempt: null,
  error: null
};

const reducer = (state = initialState, { type, payload }) =>
  produce(state, draft => {
    switch (type) {
      case FETCH_BALANCES_STARTED:
        draft.loading = true;
        break;
      case FETCH_BALANCES_FINISHED:
        draft.loading = false;
        payload.forEach(coin => {
          draft.balances[coin.type] = coin.balance;
        });
        break;
      case FETCH_BALANCES_ERROR:
        draft.loading = false;
        draft.error = payload;
        draft.lastAttempt = new Date();
        break;
      case WALLET_RESET:
        draft.address = {
          stx: null,
          btc: null
        };
        draft.type = null;
        draft.data = null;
        draft.loading = false;
        draft.lastFetch = null;
        draft.lastAttempt = null;
        draft.error = null;
        break;
      case WALLET_LOADING_STARTED:
        draft.loading = true;
        break;
      case WALLET_LOADING_FINISHED:
        draft.loading = false;
        break;
      case ADD_WALLET_ADDRESS:
        draft.addresses = payload.addresses;
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
};
