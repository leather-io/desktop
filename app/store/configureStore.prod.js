import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createHistory from "history/createHashHistory";
import { routerMiddleware } from "connected-react-router";
import rootReducer from "./reducers";
import type { walletStateType } from "./reducers/wallet";
import { persistStore, persistReducer } from "redux-persist";
import createElectronStorage from "redux-persist-electron-storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import getPersistMiddleware from 'redux-persist-middleware'

const persistConfig = {
  key: "root",
  storage: createElectronStorage(),
  stateReconciler: autoMergeLevel2
};
const history = createHistory();

const configureStore = (initialState?: { wallet: walletStateType }) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];
  // Thunk Middleware
  middleware.push(thunk);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators: {}
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer(history), initialState, enhancer);
  return {
    store
  };
};

export default { configureStore, history };
