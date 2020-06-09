import { createReducer, createSelector } from '@reduxjs/toolkit';
import log from 'electron-log';

import { RootState } from '../reducers';
import { persistMnemonicSafe, removeMnemonic, persistMnemonic } from './keys.actions';

export interface KeysState {
  mnemonic: string | null;
}

const initialState: Readonly<KeysState> = Object.freeze({
  mnemonic: null,
});

export const keyReducer = createReducer(initialState, builder =>
  builder
    .addCase(persistMnemonicSafe, (state, action) => {
      if (state.mnemonic !== null) {
        log.warn('generateMnemonicSafe failed. Tried to create mnemonic when one already exists.');
        return state;
      }
      return { mnemonic: action.payload };
    })
    .addCase(persistMnemonic, (_state, action) => ({ mnemonic: action.payload }))
    .addCase(removeMnemonic, () => ({ mnemonic: null }))
);

const selectKeysSlice = (state: RootState) => state.keys;

export const selectMnemonic = createSelector(selectKeysSlice, state => state.mnemonic);
