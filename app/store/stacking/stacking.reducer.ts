import {
  CoreNodePoxResponse,
  CoreNodeInfoResponse,
  NetworkBlockTimesResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { NETWORK } from '@constants/index';
import { selectIsStackingCallPending } from '@store/pending-transaction';
import {
  fetchStackingInfo,
  fetchCoreDetails,
  fetchBlockTimeInfo,
  fetchStackerInfo,
  activeStackingTx,
  removeStackingTx,
} from './stacking.actions';
import { stxToMicroStx } from '@utils/unit-convert';
import { StackerInfo as StackerInfoFromClient } from '@stacks/stacking';

export enum StackingStatus {
  NotStacking = 'NotStacking',
  StackedPreCycle = 'StackedPreCycle',
  StackedActive = 'StackedActive',
  FinishedStacking = 'FinishedStacking',
}

export interface StackerInfoFail {
  error: string;
}

type StackerInfo = StackerInfoFromClient | StackerInfoFail;

export interface StackingState {
  initialRequestsComplete: Record<
    'poxInfo' | 'coreNodeInfo' | 'blockTimeInfo' | 'stackerInfo',
    boolean
  >;
  error: string | null;
  contractCallTx: string | null;
  poxInfo: CoreNodePoxResponse | null;
  coreNodeInfo: CoreNodeInfoResponse | null;
  blockTimeInfo: NetworkBlockTimesResponse | null;
  stackerInfo: Required<StackerInfoFromClient>['details'] | null;
}

const initialState: StackingState = {
  initialRequestsComplete: {
    poxInfo: false,
    coreNodeInfo: false,
    blockTimeInfo: false,
    stackerInfo: false,
  },
  error: null,
  contractCallTx: null,
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
    [fetchStackingInfo.fulfilled.toString()]: (
      state,
      action: PayloadAction<CoreNodePoxResponse>
    ) => {
      state.initialRequestsComplete.poxInfo = true;
      state.poxInfo = action.payload;
    },
    [fetchCoreDetails.fulfilled.toString()]: (
      state,
      action: PayloadAction<CoreNodeInfoResponse>
    ) => {
      state.initialRequestsComplete.coreNodeInfo = true;
      state.coreNodeInfo = action.payload;
    },
    [fetchBlockTimeInfo.fulfilled.toString()]: (
      state,
      action: PayloadAction<NetworkBlockTimesResponse>
    ) => {
      state.initialRequestsComplete.blockTimeInfo = true;
      state.blockTimeInfo = action.payload;
    },
    [fetchStackerInfo.fulfilled.toString()]: (
      state,
      action: PayloadAction<Required<StackerInfo>>
    ) => {
      state.initialRequestsComplete.stackerInfo = true;
      if ('error' in action.payload || !action.payload.stacked) {
        state.error = 'There was an error stacking';
        return;
      }
      state.stackerInfo = action.payload.details;
      state.error = null;
    },
    [fetchStackerInfo.rejected.toString()]: state => {
      state.initialRequestsComplete.stackerInfo = true;
    },
    [activeStackingTx.toString()]: (state, action: PayloadAction<{ txId: string }>) => {
      state.contractCallTx = action.payload.txId;
    },
    [removeStackingTx.toString()]: state => {
      state.contractCallTx = null;
    },
  },
});

export const stackingActions = stackingSlice.actions;

export const selectStackingState = (state: RootState) => state.stacking;
export const selectCoreNodeInfo = createSelector(selectStackingState, state => state.coreNodeInfo);
export const selectBlockTimeInfo = createSelector(
  selectStackingState,
  state => state.blockTimeInfo
);

export const selectStackingError = createSelector(selectStackingState, state => state.error);

export const selectLoadingStacking = createSelector(
  selectStackingState,
  state => !Object.values(state.initialRequestsComplete).every(value => value === true)
);

export const selectActiveStackingTxId = createSelector(
  selectStackingState,
  state => state.contractCallTx
);

export const selectPoxInfo = createSelector(selectStackingState, state => {
  if (state.poxInfo === null) return null;
  const paddingStackingMargin = stxToMicroStx(100).toNumber();
  const paddedMinimumStackingAmountMicroStx =
    Math.ceil(state.poxInfo.min_amount_ustx / paddingStackingMargin) * paddingStackingMargin;
  return { ...state.poxInfo, paddedMinimumStackingAmountMicroStx };
});

export const selectStackerInfo = createSelector(selectStackingState, state => {
  if (state.poxInfo === null || state.stackerInfo === null) return null;

  const hasStackingCycleStarted =
    state.poxInfo.reward_cycle_id >= state.stackerInfo.first_reward_cycle;

  const hasStackingPeriodFinished =
    state.poxInfo.reward_cycle_id >
    state.stackerInfo.lock_period - 1 + state.stackerInfo.first_reward_cycle;

  const currentCycleOfTotal =
    state.poxInfo.reward_cycle_id - state.stackerInfo.first_reward_cycle < 0
      ? 0
      : state.poxInfo.reward_cycle_id - state.stackerInfo.first_reward_cycle + 1;

  const isPreStackingPeriodStart =
    state.poxInfo.reward_cycle_id < state.stackerInfo.first_reward_cycle;

  const isCurrentlyStacking = hasStackingCycleStarted && !hasStackingPeriodFinished;

  let status: StackingStatus = StackingStatus.NotStacking;
  if (isPreStackingPeriodStart) status = StackingStatus.StackedPreCycle;
  if (isCurrentlyStacking) status = StackingStatus.StackedActive;
  if (hasStackingPeriodFinished) status = StackingStatus.FinishedStacking;

  return {
    status,
    isCurrentlyStacking,
    hasStackingPeriodFinished,
    isPreStackingPeriodStart,
    hasAddressStackingCycleStarted: hasStackingCycleStarted,
    currentCycleOfTotal,
    ...state.stackerInfo,
  };
});

export const selectNextCycleInfo = createSelector(
  selectStackingState,
  selectIsStackingCallPending,
  ({ poxInfo, coreNodeInfo, blockTimeInfo }, isStackingCallPending) => {
    if (poxInfo === null || coreNodeInfo === null || blockTimeInfo === null) return null;

    const nextCycleStartBlock = (poxInfo.reward_cycle_id + 1) * poxInfo.reward_cycle_length + 1;

    const blocksToNextCycle =
      poxInfo.reward_cycle_length -
      ((coreNodeInfo.burn_block_height - poxInfo.first_burnchain_block_height - 1) %
        poxInfo.reward_cycle_length);

    const secondsToNextCycle = blocksToNextCycle * blockTimeInfo[NETWORK].target_block_time;

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
      nextCycleStartBlock,
      secondsToNextCycle,
      nextCycleStartingAt,
      timeUntilCycle,
      formattedTimeToNextCycle,
      blocksToNextCycle,
      isStackingCallPending,
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
