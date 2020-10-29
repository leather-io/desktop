/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
import { createStore, applyMiddleware, compose } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';

import { RootState, createRootReducer, persistConfig } from '.';
import { getInitialStateFromDisk } from '@utils/disk-store';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (obj: Record<string, unknown>) => typeof compose;
  }
  interface NodeModule {
    hot?: {
      accept: (path: string, cb: () => void) => void;
    };
  }
}

export const history = createHashHistory();

const rootReducer = createRootReducer({ history, keys: getInitialStateFromDisk() });

export const configureStore = (initialState?: RootState) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators,
      })
    : compose;

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers<any>(...enhancers);

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  // Create Store
  const store = createStore(persistedReducer, initialState, enhancer);

  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept('./index', () => store.replaceReducer(require('./index').default));
  }

  return { store, persistor };
};
