import { createSlice, createSelector } from '@reduxjs/toolkit';
import { selectAddressBalance } from '@store/address';
import { selectIsStackingCallPending } from '@store/pending-transaction';
import {
  selectActiveStackingTxId,
  selectLoadingStacking,
  selectPoxInfo,
  selectStackerInfo,
  selectStackingError,
} from '@store/stacking';
import BigNumber from 'bignumber.js';

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

export enum HomeCardState {
  LoadingResources,
  NotEnoughStx,
  EligibleToParticipate,
  StackingPendingContactCall,
  StackingPreCycle,
  StackingActive,
  PostStacking,
  StackingError,
}

const selectLoadingCardResources = createSelector(
  selectAddressBalance,
  selectLoadingStacking,
  (balance, isLoadingStacking) => balance === null || isLoadingStacking
);

const selectMeetsMinStackingThreshold = createSelector(
  selectAddressBalance,
  selectPoxInfo,
  (balance, poxInfo) => {
    if (balance === null || poxInfo === null) return false;
    return new BigNumber(balance).isGreaterThan(poxInfo.paddedMinimumStackingAmountMicroStx);
  }
);

const selectShowErrorCard = createSelector(selectStackingError, state => {
  return Object.values(state).some(val => val === true);
});

export const selectHomeCardState = createSelector(
  selectLoadingCardResources,
  selectActiveStackingTxId,
  selectMeetsMinStackingThreshold,
  selectIsStackingCallPending,
  selectStackerInfo,
  selectShowErrorCard,
  (
    loadingResources,
    activeStackingTxId,
    meetsMinThreshold,
    stackingCallPending,
    stackerInfo,
    stackingErr
  ) => {
    if (stackingErr) return HomeCardState.StackingError;
    if (loadingResources) return HomeCardState.LoadingResources;
    if (!meetsMinThreshold) return HomeCardState.NotEnoughStx;
    if (stackingCallPending || typeof activeStackingTxId === 'string')
      return HomeCardState.StackingPendingContactCall;
    if (stackerInfo?.isPreStackingPeriodStart) return HomeCardState.StackingPreCycle;
    if (stackerInfo?.isCurrentlyStacking) return HomeCardState.StackingActive;
    if (meetsMinThreshold) return HomeCardState.EligibleToParticipate;
    return HomeCardState.PostStacking;
  }
);
