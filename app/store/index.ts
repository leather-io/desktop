import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';

import { KeysState, createKeysReducer } from './keys';

export interface RootState {
  router: any;
  keys: KeysState;
}

export type GetState = () => RootState;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<RootState, Action<string>>;

interface RootReducerArgs {
  history: any;
  keys: Partial<KeysState>;
}

export function createRootReducer({ history, keys }: RootReducerArgs) {
  return combineReducers({
    router: connectRouter(history),
    keys: createKeysReducer(keys),
  });
}
