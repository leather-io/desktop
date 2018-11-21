import { ACCEPT_TERMS, TOGGLE_MODAL } from "@stores/reducers/app";

const doAcceptTerms = () => dispatch =>
  dispatch({
    type: ACCEPT_TERMS
  });

const doToggleModalClose = () => dispatch => dispatch({ type: TOGGLE_MODAL });

export { doAcceptTerms, doToggleModalClose };
