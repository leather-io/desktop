import { RootState, createRootReducer, persistConfig } from '.';
import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import { getInitialStateFromDisk } from '@utils/disk-store';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

export const history = createHashHistory();
const rootReducer = createRootReducer({ history, keys: getInitialStateFromDisk() });
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

export function configureStore(initialState?: RootState) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const persistedReducer = persistReducer(persistConfig, rootReducer as any);
  const store = createStore(persistedReducer, initialState, enhancer);
  const persistor = persistStore(store);

  return { store, persistor };
}
