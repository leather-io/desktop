import { createSlice, createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';

export interface HomeState {
  txModalOpen: boolean;
}

const initialState: HomeState = {
  txModalOpen: false,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    openModal: state => ({ ...state, txModalOpen: true }),
    closeModal: state => ({ ...state, txModalOpen: false }),
  },
});

export const homeActions = homeSlice.actions;

export const selectHomeState = (state: RootState) => state.home;

export const selectTxModalOpen = createSelector(selectHomeState, state => state.txModalOpen);
