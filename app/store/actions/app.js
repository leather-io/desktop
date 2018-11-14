import { ACCEPT_TERMS } from "@stores/reducers/app";

const doAcceptTerms = () => dispatch =>
  dispatch({
    type: ACCEPT_TERMS
  });

export { doAcceptTerms };
