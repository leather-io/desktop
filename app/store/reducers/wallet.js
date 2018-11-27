import produce from "immer";

const FETCH_ADDRESS_DATA_STARTED = "wallet/FETCH_ADDRESS_DATA_STARTED";
const FETCH_ADDRESS_DATA_FINISHED = "wallet/FETCH_ADDRESS_DATA_FINISHED";
const FETCH_ADDRESS_DATA_ERROR = "wallet/FETCH_ADDRESS_DATA_ERROR";

const FETCH_BALANCES_STARTED = "wallet/FETCH_BALANCES_STARTED";
const FETCH_BALANCES_FINISHED = "wallet/FETCH_BALANCES_FINISHED";
const FETCH_BALANCES_ERROR = "wallet/FETCH_BALANCES_ERROR";

const ADD_WALLET_ADDRESS = "wallet/ADD_WALLET_ADDRESS";
const ADD_WALLET_ADDRESS_SUCCESS = "wallet/ADD_WALLET_ADDRESS_SUCCESS";
const ADD_WALLET_ADDRESS_ERROR = "wallet/ADD_WALLET_ADDRESS_ERROR";

const WALLET_RESET = "wallet/WALLET_RESET";

const WALLET_LOADING_STARTED = "wallet/WALLET_LOADING_STARTED";
const WALLET_LOADING_FINISHED = "wallet/WALLET_LOADING_FINISHED";

const WALLET_SIGN_TRANSACTION_STARTED =
  "wallet/WALLET_SIGN_TRANSACTION_STARTED";
const WALLET_SIGN_TRANSACTION_FINISHED =
  "wallet/WALLET_SIGN_TRANSACTION_FINISHED";
const WALLET_SIGN_TRANSACTION_ERROR = "wallet/WALLET_SIGN_TRANSACTION_ERROR";

const WALLET_BROADCAST_TRANSACTION_STARTED =
  "wallet/WALLET_BROADCAST_TRANSACTION_STARTED";
const WALLET_BROADCAST_TRANSACTION_FINISHED =
  "wallet/WALLET_BROADCAST_TRANSACTION_FINISHED";
const WALLET_BROADCAST_TRANSACTION_ERROR =
  "wallet/WALLET_BROADCAST_TRANSACTION_ERROR";

const WALLET_CLEAR_ERROR = "wallet/WALLET_CLEAR_ERROR";

// Wallet types
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
  transactions: [],
  type: null,
  data: null,
  fetchingBalances: false,
  fetchingAddressData: false,
  loading: false,
  signing: false,
  broadcasting: false,
  lastFetch: null,
  lastAttempt: null,
  error: null
};

const reducer = (state = initialState, { type, payload }) =>
  produce(state, draft => {
    switch (type) {
      case WALLET_CLEAR_ERROR:
        draft.error = null;
        break;
      /**
       * signing transaction
       */
      case WALLET_SIGN_TRANSACTION_STARTED:
        draft.signing = true;
        break;
      case WALLET_SIGN_TRANSACTION_FINISHED:
        draft.signing = false;
        draft.transactions.push(payload);
        break;
      case WALLET_SIGN_TRANSACTION_ERROR:
        draft.signing = false;
        draft.error = payload;
        break;
      /**
       * broadcasting
       */
      case WALLET_BROADCAST_TRANSACTION_STARTED:
        draft.broadcasting = true;
        break;
      case WALLET_BROADCAST_TRANSACTION_FINISHED:
        draft.broadcasting = false;
        break;
      case WALLET_BROADCAST_TRANSACTION_ERROR:
        draft.broadcasting = false;
        draft.error = payload;
        break;
      /**
       * fetching latest balances
       */
      case FETCH_BALANCES_STARTED:
        draft.fetchingBalances = true;
        break;
      case FETCH_BALANCES_FINISHED:
        draft.fetchingBalances = false;
        payload.forEach(coin => {
          draft.balances[coin.type] = coin.balance;
        });
        break;
      case FETCH_BALANCES_ERROR:
        draft.fetchingBalances = false;
        draft.error = payload;
        draft.lastAttempt = new Date();
        break;
      /**
       * Reset wallet
       */
      case WALLET_RESET:
        draft.addresses = {
          stx: null,
          btc: null
        };
        draft.balances = {
          stx: null,
          btc: null
        };
        draft.type = null;
        draft.data = null;
        draft.transactions = [];
        draft.loading = false;
        draft.signing = false;
        draft.broadcasting = false;
        draft.lastFetch = null;
        draft.lastAttempt = null;
        draft.fetchingBalances = false;
        draft.fetchingAddressData = false;
        draft.error = null;
        break;
      /**
       * Loading (initial loading, causes full screen loader)
       */
      case WALLET_LOADING_STARTED:
        draft.loading = true;
        break;
      case WALLET_LOADING_FINISHED:
        draft.loading = false;
        break;
      /**
       * Add wallet address + type
       */
      case ADD_WALLET_ADDRESS:
        draft.addresses = payload.addresses;
        draft.type = payload.type;
        break;
      /**
       * Fetch tx history
       */
      case FETCH_ADDRESS_DATA_STARTED:
        draft.fetchingAddressData = true;
        break;
      case FETCH_ADDRESS_DATA_FINISHED:
        draft.fetchingAddressData = false;
        draft.lastFetch = new Date();
        draft.lastAttempt = null;
        draft.data = payload;
        break;
      case FETCH_ADDRESS_DATA_ERROR:
        draft.fetchingAddressData = false;
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
};
