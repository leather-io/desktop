import produce from "immer";

export const ACCEPT_TERMS = "app/ACCEPT_TERMS";

const initialState = {
  terms: false
};

export default function reducer(state = initialState, { type, payload }) {
  return produce(state, draft => {
    switch (type) {
      case ACCEPT_TERMS:
        draft.terms = true;
        break;
    }
  });
}
