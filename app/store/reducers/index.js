// @flow
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import app from "./app";
import notifications from "./notifications";
import wallet from "./wallet";

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    app,
    wallet,
    notifications
  });

export default rootReducer;
