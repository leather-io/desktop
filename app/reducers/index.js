// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import wallet from './wallet';

const rootReducer = combineReducers({
  wallet,
  router
});

export default rootReducer;
