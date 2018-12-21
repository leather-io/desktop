import { ACCEPT_TERMS, TOGGLE_MODAL } from "@stores/reducers/app";
import { PERSIST } from "redux-persist";
const doAcceptTerms = () => dispatch =>
  dispatch({
    type: ACCEPT_TERMS
  });

const doToggleModalClose = () => dispatch => dispatch({ type: TOGGLE_MODAL });
const doPersistState = () => dispatch => dispatch({ type: PERSIST });

export { doAcceptTerms, doToggleModalClose, doPersistState };
