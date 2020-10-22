import {
  CoreNodePoxResponse,
  CoreNodeInfoResponse,
  NetworkBlockTimesResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {
  fetchStackingInfo,
  fetchCoreDetails,
  fetchBlockTimeInfo,
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
    [fetchBlockTimeInfo.fulfilled.toString()]: (
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
export const selectBlockTimeInfo = createSelector(
  selectStackingState,
  state => state.blockTimeInfo
);
export const selectStackerInfo = createSelector(selectStackingState, state => state.stackerInfo);

export const selectNextCycleInfo = createSelector(
  selectStackingState,
  ({ poxInfo, coreNodeInfo, blockTimeInfo }) => {
    if (poxInfo === null || coreNodeInfo === null || blockTimeInfo === null) return null;

    const blocksToNextCycle =
      poxInfo.reward_cycle_length -
      ((coreNodeInfo.burn_block_height - poxInfo.first_burnchain_block_height) %
        poxInfo.reward_cycle_length);

    const secondsToNextCycle =
      (poxInfo.reward_cycle_length -
        ((coreNodeInfo.burn_block_height - poxInfo.first_burnchain_block_height) %
          poxInfo.reward_cycle_length)) *
      blockTimeInfo[NETWORK].target_block_time;

    const nextCycleStartingAt = new Date();
    nextCycleStartingAt.setSeconds(nextCycleStartingAt.getSeconds() + secondsToNextCycle);
    dayjs.extend(duration);

    const timeUntilCycle = {
      hours: dayjs.duration(secondsToNextCycle, 'seconds').asHours(),
      days: dayjs.duration(secondsToNextCycle, 'seconds').asDays(),
      weeks: dayjs.duration(secondsToNextCycle, 'seconds').asWeeks(),
    };

    const formattedTimeToNextCycle =
      timeUntilCycle.weeks > 1
        ? '~' + Math.ceil(timeUntilCycle.weeks).toString() + ' weeks'
        : timeUntilCycle.days < 1
        ? '~' + Math.ceil(timeUntilCycle.hours).toString() + ' hours'
        : '~' + Math.ceil(timeUntilCycle.days).toString() + ' days';

    return {
      secondsToNextCycle,
      nextCycleStartingAt,
      timeUntilCycle,
      formattedTimeToNextCycle,
      blocksToNextCycle,
    };
  }
);

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
