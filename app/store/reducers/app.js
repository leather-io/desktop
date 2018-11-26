import produce from "immer";

export const ACCEPT_TERMS = "app/ACCEPT_TERMS";
export const TOGGLE_MODAL = "app/TOGGLE_MODAL";
export const TOGGLE_MODAL_CLOSE = "app/TOGGLE_MODAL_CLOSE";
export const TOGGLE_MODAL_KEEP_OPEN = "app/TOGGLE_MODAL_KEEP_OPEN";

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
      case TOGGLE_MODAL_CLOSE:
        draft.keepModalOpen = false;
        break;
      case TOGGLE_MODAL_KEEP_OPEN:
        draft.keepModalOpen = true;
        break;
      case ACCEPT_TERMS:
        draft.terms = true;
        break;
    }
  });
}
