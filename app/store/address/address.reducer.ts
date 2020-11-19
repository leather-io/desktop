import { createReducer, createSelector } from '@reduxjs/toolkit';
import { selectLoadingStacking, selectStackerInfo } from '@store/stacking';
import BigNumber from 'bignumber.js';

import { RootState } from '..';
import { fetchAddressDone, updateAddressBalance } from './address.actions';

export interface AddressState {
  balance: string | null;
}

const initialState: AddressState = { balance: null };

export const addressReducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchAddressDone, (_state, { payload }) => ({
      balance: payload.stx.balance,
    }))
    .addCase(updateAddressBalance, (_state, action) => ({ balance: action.payload.balance }))
);

export const selectAddressState = (state: RootState) => state.address;

export const selectAddressBalance = createSelector(
  selectAddressState,
  selectLoadingStacking,
  state => state.balance
);

export const selectAvailableBalance = createSelector(
  selectAddressState,
  selectStackerInfo,
  (address, stackerInfo) => {
    if (address.balance === null) return null;
    if (stackerInfo === null) return address.balance;
    return new BigNumber(address.balance).minus(stackerInfo.amountMicroStx).toString();
  }
);
