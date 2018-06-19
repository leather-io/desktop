// @flow
import { UPDATE_SEED } from '../actions/wallet';

type actionType = {
  +type: string,
  // +seed: ?string
};

export const initialState = {
  seed: null,
  address: null,
  publicKey: null
}

export default function wallet(state = initialState, action: actionType) {
  switch (action.type) {
    case UPDATE_SEED:
      return { ...state, seed: action.seed, address: action.address, publicKey: action.publicKey }
    default:
      return state;
  }
}
