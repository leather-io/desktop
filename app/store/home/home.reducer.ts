import { createSlice, createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';

export interface HomeState {
  txModalOpen: boolean;
  receiveModalOpen: boolean;
}

const initialState: HomeState = {
  txModalOpen: false,
  receiveModalOpen: false,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    openTxModal: () => ({ txModalOpen: true, receiveModalOpen: false }),
    closeTxModal: state => ({ ...state, txModalOpen: false }),
    openReceiveModal: () => ({ receiveModalOpen: true, txModalOpen: false }),
    closeReceiveModal: state => ({ ...state, receiveModalOpen: false }),
  },
});

export const homeActions = homeSlice.actions;

export const selectHomeState = (state: RootState) => state.home;

export const selectTxModalOpen = createSelector(selectHomeState, state => state.txModalOpen);
export const selectReceiveModalOpen = createSelector(
  selectHomeState,
  state => state.receiveModalOpen
);
