import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import { KeysState, keyReducer } from '../keys';

export interface RootState {
  router: any;
  keys: KeysState;
}

export type GetState = () => RootState;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<RootState, Action<string>>;

export function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    keys: keyReducer,
  });
}
