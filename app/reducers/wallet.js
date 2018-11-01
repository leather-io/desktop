// @flow
import {
  WALLET_TYPE,
  SET_NAME,
  CREATE_NEW_SEED,
  SET_ADDRESS,
  UPDATE_BALANCE,
  USE_HARDWARE_WALLET,
  SET_HARDWARE_ERROR,
  SET_PAYLOAD,
  ERASE_SEED
} from "../actions/wallet";

import produce from "immer";

const selectors = {
  selectName: state => state.wallet.name,
  selectWalletType: state => state.wallet.walletType,
  selectSeed: state => state.wallet.seed,
  selectAddress: state => state.wallet.address,
  selectStacksBalance: state => state.wallet.stacksBalance,
  selectBtcBalance: state => state.wallet.btcBalance,
  selectPublicKey: state => state.wallet.publicKey,
  selectWalletError: state => state.wallet.error,
  selectWalletPayload: state => state.wallet.payload
};

export type walletStateType = {
  wallet: {
    name: string,
    +walletType: string,
    +seed: string,
    +address: string,
    +stacksBalance: string,
    +btcBalance: string,
    +publicKey: string,
    +error: string,
    +payload: string
  }
};

type actionType = {
  +type: string
};

export const initialState = {
  name: null,
  walletType: null,
  seed: null,
  address: null,
  stacksBalance: null,
  btcBalance: null,
  publicKey: null,
  error: null,
  payload: null
};

export default function reducer(state = initialState, action: actionType) {
  return produce(state, draft => {
    switch (action.type) {
      case SET_NAME:
        draft.name = action.name;
        break;
      case CREATE_NEW_SEED:
        draft.walletType = WALLET_TYPE.NORMAL;
        draft.seed = action.seed;
        draft.address = action.address;
        draft.publicKey = action.publicKey;
        break;
      case SET_ADDRESS:
        draft.address = action.address;
        break;
      case UPDATE_BALANCE:
        draft.stacksBalance = action.stacksBalance;
        draft.btcBalance = action.btcBalance;
        break;
      case USE_HARDWARE_WALLET:
        draft.walletType = WALLET_TYPE.HARDWARE;
        draft.address = action.address;
        draft.publicKey = action.publicKey;
        break;
      case SET_HARDWARE_ERROR:
        draft.error = action.error;
        break;
      case SET_PAYLOAD:
        draft.payload = action.payload;
        break;
      case ERASE_SEED:
        draft.seed = "";
        break;
      default:
        return draft;
    }
  });
}
