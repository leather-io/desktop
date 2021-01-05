import { Store as ReduxStore, Action } from 'redux';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { PersistConfig } from 'redux-persist';

import { KeysState, createKeysReducer } from './keys';
import { TransactionState, transactionReducer } from './transaction';
import { addressReducer, AddressState } from './address';
import { HomeState, homeSlice } from './home';
import { pendingTransactionReducer, PendingTransactionState } from './pending-transaction';
import { stacksNodeReducer, StacksNodeState } from './stacks-node';
import { MempoolState, mempoolReducer } from './mempool';
import { StackingState, stackingSlice } from './stacking';
import { reduxPersistElectronStore } from './persist-middleware';
import { configureStore } from './configureStore';

export interface RootState {
  router: any;
  keys: KeysState;
  transaction: TransactionState;
  pendingTransaction: PendingTransactionState;
  address: AddressState;
  home: HomeState;
  stacksNode: StacksNodeState;
  stacking: StackingState;
  mempool: MempoolState;
  _persist: any;
}

export type GetState = () => RootState;

export type Store = ReduxStore<RootState, Action<string>>;

export const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: reduxPersistElectronStore(),
  whitelist: ['stacksNode'],
};

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
    stacking: stackingSlice.reducer,
    mempool: mempoolReducer,
  });
}

export type Dispatch = ReturnType<typeof configureStore>['store']['dispatch'];
