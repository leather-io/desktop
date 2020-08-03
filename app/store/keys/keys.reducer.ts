import { createReducer, createSelector } from '@reduxjs/toolkit';
import log from 'electron-log';

import { RootState } from '..';
import {
  setPasswordSuccess,
  attemptWalletDecryptSuccess,
  updateLedgerAddress,
} from './keys.actions';
import {
  persistMnemonicSafe,
  persistMnemonic,
  attemptWalletDecryptFailed,
  attemptWalletDecrypt,
} from './keys.actions';

export interface KeysState {
  walletType: 'ledger' | 'software';
  mnemonic: string | null;
  decrypting: boolean;
  salt?: string;
  decryptionError?: string;
  encryptedMnemonic?: string;
  stxAddress?: string;
}

const initialState: Readonly<KeysState> = Object.freeze({
  mnemonic: null,
  decrypting: false,
  walletType: 'software',
});

export const createKeysReducer = (keys: Partial<KeysState> = {}) =>
  createReducer({ ...initialState, ...keys }, builder =>
    builder
      .addCase(persistMnemonicSafe, (state, action) => {
        if (state.mnemonic !== null) {
          log.warn(
            'generateMnemonicSafe failed. Tried to create mnemonic when one already exists.'
          );
          return state;
        }
        return { ...state, mnemonic: action.payload };
      })
      .addCase(persistMnemonic, (state, action) => ({ ...state, mnemonic: action.payload }))
      .addCase(setPasswordSuccess, (state, action) => ({ ...state, ...action.payload }))
      .addCase(attemptWalletDecrypt, state => ({ ...state, decrypting: true }))
      .addCase(attemptWalletDecryptFailed, (state, action) => ({
        ...state,
        decrypting: false,
        decryptionError: action.payload.decryptionError,
      }))
      .addCase(attemptWalletDecryptSuccess, (state, { payload }) => ({
        ...state,
        salt: payload.salt,
        decrypting: false,
        mnemonic: payload.mnemonic,
        stxAddress: payload.address,
      }))
      .addCase(updateLedgerAddress, (state, { payload }) => ({
        ...state,
        stxAddress: payload,
        walletType: 'ledger',
      }))
  );

export const selectKeysSlice = (state: RootState) => state.keys;
export const selectDecryptionError = createSelector(
  selectKeysSlice,
  state => state.decryptionError
);
export const selectIsDecrypting = createSelector(selectKeysSlice, state => state.decrypting);

export const selectMnemonic = createSelector(selectKeysSlice, state => state.mnemonic);
export const selectEncryptedMnemonic = createSelector(
  selectKeysSlice,
  state => state.encryptedMnemonic
);
export const selectAddress = createSelector(selectKeysSlice, state => state.stxAddress);
export const selectSalt = createSelector(selectKeysSlice, state => state.salt);
