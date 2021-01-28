import {
  CoreNodePoxResponse,
  CoreNodeInfoResponse,
  NetworkBlockTimesResponse,
} from '@blockstack/stacks-blockchain-api-types';
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { NETWORK } from '@constants/index';
import { selectIsStackingCallPending, selectPendingTransactions } from '@store/pending-transaction';
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
import { selectAddressBalance } from '@store/address';
import BigNumber from 'bignumber.js';
import { isRevokingDelegationTx, isDelegateStxTx } from '@utils/tx-utils';

dayjs.extend(duration);
dayjs.extend(relativeTime);

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
  errors: Record<'poxInfo' | 'coreNodeInfo' | 'blockTimeInfo' | 'stackerInfo', boolean>;
  contractCallTx: string | null;
  poxInfo: CoreNodePoxResponse | null;
  coreNodeInfo: CoreNodeInfoResponse | null;
  blockTimeInfo: NetworkBlockTimesResponse | null;
  stackerInfo: {
    stacked: true;
    details: {
      amount_microstx: string;
      first_reward_cycle: number;
      lock_period: number;
      unlock_height: number;
      pox_address: {
        version: Buffer;
        hashbytes: Buffer;
      };
    };
  } | null;
}

const initialState: StackingState = {
  initialRequestsComplete: {
    poxInfo: false,
    coreNodeInfo: false,
    blockTimeInfo: false,
    stackerInfo: false,
  },
  errors: {
    poxInfo: false,
    coreNodeInfo: false,
    blockTimeInfo: false,
    stackerInfo: false,
  },
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
      state.errors.poxInfo = false;
      state.poxInfo = action.payload;
    },
    [fetchStackingInfo.rejected.toString()]: state => {
      if (!state.initialRequestsComplete.poxInfo) {
        state.errors.poxInfo = true;
      }
    },
    [fetchCoreDetails.fulfilled.toString()]: (
      state,
      action: PayloadAction<CoreNodeInfoResponse>
    ) => {
      state.initialRequestsComplete.coreNodeInfo = true;
      state.errors.coreNodeInfo = false;
      state.coreNodeInfo = action.payload;
    },
    [fetchCoreDetails.rejected.toString()]: state => {
      if (!state.initialRequestsComplete.coreNodeInfo) {
        state.errors.coreNodeInfo = true;
      }
    },
    [fetchBlockTimeInfo.fulfilled.toString()]: (
      state,
      action: PayloadAction<NetworkBlockTimesResponse>
    ) => {
      state.errors.blockTimeInfo = false;
      state.initialRequestsComplete.blockTimeInfo = true;
      state.blockTimeInfo = action.payload;
    },
    [fetchBlockTimeInfo.rejected.toString()]: state => {
      if (!state.initialRequestsComplete.blockTimeInfo) {
        state.errors.blockTimeInfo = true;
      }
    },
    [fetchStackerInfo.fulfilled.toString()]: (
      state,
      action: PayloadAction<Required<StackerInfo>>
    ) => {
      state.initialRequestsComplete.stackerInfo = true;
      state.errors.stackerInfo = false;
      if ('error' in action.payload || !action.payload.stacked) {
        return;
      }
      state.stackerInfo = action.payload;
    },
    [fetchStackerInfo.rejected.toString()]: state => {
      state.initialRequestsComplete.stackerInfo = true;
      if (!state.initialRequestsComplete.stackerInfo) state.errors.stackerInfo = true;
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

export const selectStackingError = createSelector(selectStackingState, state => state.errors);

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

export const selectStackerInfo = createSelector(
  selectStackingState,

  selectAddressBalance,
  (state, addressBalances) => {
    if (
      state.poxInfo === null ||
      state.stackerInfo === null ||
      state.coreNodeInfo === null ||
      addressBalances === null
    ) {
      return null;
    }

    const hasStackingPeriodFinished =
      addressBalances.burnchain_unlock_height <= state.coreNodeInfo.burn_block_height;

    const currentCycleOfTotal =
      state.poxInfo.reward_cycle_id - state.stackerInfo.details.first_reward_cycle < 0
        ? 0
        : state.poxInfo.reward_cycle_id - state.stackerInfo.details.first_reward_cycle + 1;

    const isPreStackingPeriodStart =
      state.coreNodeInfo.burn_block_height <= addressBalances.lock_height;

    const isCurrentlyStacking =
      !isPreStackingPeriodStart && !hasStackingPeriodFinished && addressBalances.lock_height !== 0;

    const cycleLengthInBlocks =
      addressBalances.burnchain_unlock_height - addressBalances.burnchain_lock_height;

    const blocksUntilUnlocked =
      addressBalances.burnchain_unlock_height - state.coreNodeInfo.burn_block_height;

    const blocksUntilStackingCycleBegins =
      addressBalances.lock_height - state.coreNodeInfo.burn_block_height;

    const stackingPercentage =
      ((cycleLengthInBlocks - blocksUntilUnlocked) / cycleLengthInBlocks) * 100;

    let status: StackingStatus = StackingStatus.NotStacking;
    if (isPreStackingPeriodStart) status = StackingStatus.StackedPreCycle;
    if (isCurrentlyStacking) status = StackingStatus.StackedActive;
    if (hasStackingPeriodFinished) status = StackingStatus.FinishedStacking;

    return {
      status,
      stackingPercentage,
      isCurrentlyStacking,
      hasStackingPeriodFinished,
      isPreStackingPeriodStart,
      currentCycleOfTotal,
      blocksUntilStackingCycleBegins,
      ...state.stackerInfo,
    };
  }
);

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

    const now = dayjs();
    const timeOfNextCycle = now.add(secondsToNextCycle, 'second');
    const formattedTimeToNextCycle = dayjs().to(timeOfNextCycle, true);

    const estimateCycleDurationSeconds =
      poxInfo.reward_cycle_length * blockTimeInfo[NETWORK].target_block_time;

    const estimateCycleDuration = dayjs
      .duration(estimateCycleDurationSeconds, 'seconds')
      .humanize();

    return {
      nextCycleStartBlock,
      secondsToNextCycle,
      estimateCycleDurationSeconds,
      estimateCycleDuration,
      nextCycleStartingAt,
      formattedTimeToNextCycle,
      blocksToNextCycle,
      isStackingCallPending,
    };
  }
);

export const selectMeetsMinStackingThreshold = createSelector(
  selectAddressBalance,
  selectPoxInfo,
  (addressDetails, poxInfo) => {
    if (addressDetails === null || poxInfo === null) return false;
    return new BigNumber(addressDetails.balance).isGreaterThan(
      poxInfo.paddedMinimumStackingAmountMicroStx
    );
  }
);

// `rejection_votes_left_required` not returned by API
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const stackingWillBeExecuted = createSelector(selectStackingState, () => {});

export const selectEstimatedStackingDuration = (cycles: number) =>
  createSelector(selectStackingState, ({ poxInfo, blockTimeInfo }) => {
    if (poxInfo === null || blockTimeInfo === null) return '—';
    return dayjs
      .duration(
        poxInfo.reward_cycle_length * blockTimeInfo[NETWORK].target_block_time * cycles,
        'seconds'
      )
      .humanize();
  });

export const selectHasPendingRevokingDelegationCall = createSelector(
  selectPendingTransactions,
  selectPoxInfo,
  (pendingTxs, pox) => pendingTxs.some(tx => isRevokingDelegationTx(tx, pox?.contract_id))
);

export const selectHasPendingDelegateStxCall = createSelector(
  selectPendingTransactions,
  selectPoxInfo,
  (pendingTxs, pox) => pendingTxs.some(tx => isDelegateStxTx(tx, pox?.contract_id))
);
