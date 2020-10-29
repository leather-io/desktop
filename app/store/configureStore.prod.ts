import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { persistReducer, persistStore } from 'redux-persist';

import { RootState, createRootReducer, persistConfig } from '.';
import { getInitialStateFromDisk } from '@utils/disk-store';

export const history = createHashHistory();
const rootReducer = createRootReducer({ history, keys: getInitialStateFromDisk() });
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

export function configureStore(initialState?: RootState) {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = createStore(persistedReducer, initialState, enhancer);
  const persistor = persistStore(store);

  return { store, persistor };
}
