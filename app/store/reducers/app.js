import produce from "immer";

export const ACCEPT_TERMS = "app/ACCEPT_TERMS";
export const TOGGLE_MODAL = "app/TOGGLE_MODAL";

const initialState = {
  terms: false,
  keepModalOpen: false
};

export default function reducer(state = initialState, { type, payload }) {
  return produce(state, draft => {
    switch (type) {
      case TOGGLE_MODAL:
        draft.keepModalOpen = !draft.keepModalOpen;
        break;
      case ACCEPT_TERMS:
        draft.terms = true;
        break;
    }
  });
}
