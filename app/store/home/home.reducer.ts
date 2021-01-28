import { createSlice, createSelector } from '@reduxjs/toolkit';
import { selectAddressBalance as selectAddressDetails } from '@store/address';
import { selectIsStackingCallPending } from '@store/pending-transaction';
import {
  selectActiveStackingTxId,
  selectLoadingStacking,
  selectMeetsMinStackingThreshold,
  selectStackerInfo,
  selectStackingError,
} from '@store/stacking';

import { RootState } from '..';

type HomeModals = 'txModal' | 'receiveModal' | 'revokeDelegationModal';

export interface HomeState {
  activeModal: HomeModals | null;
}

const initialState: HomeState = {
  activeModal: null,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    //
    // TODO: refactor post-delegation
    openTxModal: () => ({ activeModal: 'txModal' as HomeModals }),
    closeTxModal: () => ({ activeModal: null }),
    openReceiveModal: () => ({ activeModal: 'receiveModal' as HomeModals }),
    closeReceiveModal: () => ({ activeModal: null }),
    openRevokeDelegationModal: () => ({ activeModal: 'revokeDelegationModal' as HomeModals }),
    closeRevokeDelegationModal: () => ({ activeModal: null }),
  },
});

export const homeActions = homeSlice.actions;

export const selectHomeState = (state: RootState) => state.home;

export const selectTxModalOpen = createSelector(
  selectHomeState,
  state => state.activeModal === 'txModal'
);
export const selectReceiveModalOpen = createSelector(
  selectHomeState,
  state => state.activeModal === 'receiveModal'
);
export const selectRevokeDelegationModalOpen = createSelector(
  selectHomeState,
  state => state.activeModal === 'revokeDelegationModal'
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
  selectAddressDetails,
  selectLoadingStacking,
  (balance, isLoadingStacking) => balance === null || isLoadingStacking
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
