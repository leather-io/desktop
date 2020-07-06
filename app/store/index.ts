import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';

import { KeysState, createKeysReducer } from './keys';
import { TransactionState, transactionReducer } from './transaction/transaction.reducer';
import { addressReducer, AddressState } from './address';
import { HomeState, homeSlice } from './home/home.reducer';

export interface RootState {
  router: any;
  keys: KeysState;
  transaction: TransactionState;
  address: AddressState;
  home: HomeState;
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
    transaction: transactionReducer,
    address: addressReducer,
    home: homeSlice.reducer,
  });
}
