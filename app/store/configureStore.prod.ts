import { createStore, applyMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { RootState, createRootReducer } from '.';
import { getInitialStateFromDisk } from '../utils/disk-store';

export const history = createHashHistory();
const rootReducer = createRootReducer({ history, keys: getInitialStateFromDisk() });
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

export function configureStore(initialState?: RootState) {
  return createStore(rootReducer, initialState, enhancer);
}
