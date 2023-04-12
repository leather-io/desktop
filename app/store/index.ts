import { addressReducer, AddressState } from './address';
import { configureStore } from './configureStore';
import { HomeState, homeSlice } from './home';
import { KeysState, createKeysReducer } from './keys';
import { pendingTransactionReducer, PendingTransactionState } from './pending-transaction';
import { reduxPersistElectronStore } from './persist-middleware';
import { settingsReducer, SettingsState } from './settings';
import { StackingState, stackingSlice } from './stacking';
import { stacksNodeReducer, StacksNodeState } from './stacks-node';
import { TransactionState, transactionReducer } from './transaction';
import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { Store as ReduxStore, Action } from 'redux';
import { PersistConfig } from 'redux-persist';

export interface RootState {
  router: any;
  keys: KeysState;
  transaction: TransactionState;
  pendingTransaction: PendingTransactionState;
  address: AddressState;
  home: HomeState;
  stacksNode: StacksNodeState;
  stacking: StackingState;
  settings: SettingsState;
  _persist: any;
}

export type GetState = () => RootState;

export type Store = ReduxStore<RootState, Action<string>>;

export const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage: reduxPersistElectronStore(),
  whitelist: ['stacksNode', 'settings'],
};

interface RootReducerArgs {
  history: any;
  keys: Partial<KeysState>;
}

export function createRootReducer({ history, keys }: RootReducerArgs) {
  return combineReducers({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    router: connectRouter(history),
    keys: createKeysReducer(keys),
    transaction: transactionReducer,
    pendingTransaction: pendingTransactionReducer,
    address: addressReducer,
    home: homeSlice.reducer,
    stacksNode: stacksNodeReducer,
    stacking: stackingSlice.reducer,
    settings: settingsReducer,
  });
}

export type Dispatch = ReturnType<typeof configureStore>['store']['dispatch'];
