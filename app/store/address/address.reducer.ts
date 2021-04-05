import { AddressStxBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { createReducer, createSelector } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { RootState } from '..';
import { fetchAddressDone, updateAddressBalance } from './address.actions';

export interface AddressState {
  loading: boolean;
  details: AddressStxBalanceResponse | null;
}

const initialState: AddressState = {
  loading: true,
  details: null,
};

export const addressReducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchAddressDone, (state, { payload }) => {
      state.loading = false;
      state.details = payload;
    })
    .addCase(updateAddressBalance, (state, action) => {
      if (state.details === null) return;
      state.details.balance = action.payload.balance;
    })
);

export const selectAddressState = (state: RootState) => state.address;

export const selectAddressBalance = createSelector(selectAddressState, state => state.details);

export const selectAvailableBalance = createSelector(selectAddressState, address => {
  if (address.details === null) return null;
  return new BigNumber(address.details.balance).minus(address.details.locked).toString();
});

export const selectTotalBalance = createSelector(selectAddressState, address => {
  if (address.details === null) return null;
  return new BigNumber(address.details.balance);
});

export const selectLockedBalance = createSelector(selectAddressState, address => {
  if (address.details === null) return null;
  return new BigNumber(address.details.locked);
});
