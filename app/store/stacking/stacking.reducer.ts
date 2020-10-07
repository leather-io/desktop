import {
  CoreNodePoxResponse,
  CoreNodeInfoResponse,
  NetworkBlockTimesResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import { fetchStackingInfo, fetchCoreDetails, fetchBlocktimeInfo } from './stacking.actions';
import { NETWORK } from '../../constants/index';

export interface StackingState {
  poxInfo: CoreNodePoxResponse | null;
  coreNodeInfo: CoreNodeInfoResponse | null;
  blockTimeInfo: NetworkBlockTimesResponse | null;
}

const initialState: StackingState = {
  poxInfo: null,
  coreNodeInfo: null,
  blockTimeInfo: null,
};

export const stackingSlice = createSlice({
  name: 'stacking',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStackingInfo.fulfilled.toString()]: (state, a: PayloadAction<CoreNodePoxResponse>) => {
      state.poxInfo = a.payload;
    },
    [fetchCoreDetails.fulfilled.toString()]: (state, a: PayloadAction<CoreNodeInfoResponse>) => {
      state.coreNodeInfo = a.payload;
    },
    [fetchBlocktimeInfo.fulfilled.toString()]: (s, a: PayloadAction<NetworkBlockTimesResponse>) => {
      s.blockTimeInfo = a.payload;
    },
  },
});

export const stackingActions = stackingSlice.actions;

export const selectStackingState = (state: RootState) => state.stacking;
export const selectPoxInfo = createSelector(selectStackingState, state => state.poxInfo);
export const selectCoreNodeInfo = createSelector(selectStackingState, state => state.coreNodeInfo);
export const selectBlocktimeInfo = createSelector(
  selectStackingState,
  state => state.blockTimeInfo
);

// `rejection_votes_left_required` not returned by API
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const stackingWillBeExecuted = createSelector(selectStackingState, () => {});

export const estimatedStackingCycleDuration = createSelector(
  selectStackingState,
  ({ poxInfo, blockTimeInfo }) => {
    if (poxInfo === null || blockTimeInfo === null) return 0;
    return poxInfo.reward_cycle_length * blockTimeInfo[NETWORK].target_block_time;
  }
);
