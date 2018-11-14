// @flow
import { combineReducers } from "redux";
import { routerReducer as router } from "react-router-redux";
import app from "./app";
import wallet from "./wallet";

const rootReducer = combineReducers({
  router,
  app,
  wallet
});

export default rootReducer;
