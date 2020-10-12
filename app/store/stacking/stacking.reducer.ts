import {
  CoreNodePoxResponse,
  CoreNodeInfoResponse,
  NetworkBlockTimesResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import {
  fetchStackingInfo,
  fetchCoreDetails,
  fetchBlocktimeInfo,
  fetchStackerInfo,
} from './stacking.actions';
import { NETWORK } from '../../constants/index';
import { StackerInfo } from '@utils/stacking/pox';

export interface StackingState {
  poxInfo: CoreNodePoxResponse | null;
  coreNodeInfo: CoreNodeInfoResponse | null;
  blockTimeInfo: NetworkBlockTimesResponse | null;
  stackerInfo: StackerInfo | null;
}

const initialState: StackingState = {
  poxInfo: null,
  coreNodeInfo: null,
  blockTimeInfo: null,
  stackerInfo: null,
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
    [fetchBlocktimeInfo.fulfilled.toString()]: (
      state,
      a: PayloadAction<NetworkBlockTimesResponse>
    ) => {
      state.blockTimeInfo = a.payload;
    },
    [fetchStackerInfo.fulfilled.toString()]: (state, a: PayloadAction<StackerInfo>) => {
      state.stackerInfo = a.payload;
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
export const selectStackerInfo = createSelector(selectStackingState, state => state.stackerInfo);

// `rejection_votes_left_required` not returned by API
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const stackingWillBeExecuted = createSelector(selectStackingState, () => {});

export const selectEstimatedStackingCycleDuration = createSelector(
  selectStackingState,
  ({ poxInfo, blockTimeInfo }) => {
    if (poxInfo === null || blockTimeInfo === null) return 0;
    return poxInfo.reward_cycle_length * blockTimeInfo[NETWORK].target_block_time;
  }
);
