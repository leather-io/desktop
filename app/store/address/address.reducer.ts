import { createReducer, createSelector } from '@reduxjs/toolkit';

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

export const selectAddressBalance = createSelector(selectAddressState, state => state.balance);
