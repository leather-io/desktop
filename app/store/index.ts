import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';

import { KeysState, createKeysReducer } from './keys';
import { TransactionState, transactionReducer } from './transaction';
import { addressReducer, AddressState } from './address';
import { HomeState, homeSlice } from './home';
import { pendingTransactionReducer, PendingTransactionState } from './pending-transaction';
import { stacksNodeReducer, StacksNodeState } from './stacks-node';

export interface RootState {
  router: any;
  keys: KeysState;
  transaction: TransactionState;
  pendingTransaction: PendingTransactionState;
  address: AddressState;
  home: HomeState;
  stacksNode: StacksNodeState;
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
    pendingTransaction: pendingTransactionReducer,
    address: addressReducer,
    home: homeSlice.reducer,
    stacksNode: stacksNodeReducer,
  });
}
