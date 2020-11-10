import { createReducer, createSelector } from '@reduxjs/toolkit';
import log from 'electron-log';

import { RootState } from '..';
import { WalletType } from '../../types/wallet-type';
import {
  setPasswordSuccess,
  persistLedgerWallet,
  persistMnemonicSafe,
  persistMnemonic,
} from './keys.actions';

//
// TODO: create separate state slices per wallet type
export interface KeysState {
  walletType: WalletType;
  mnemonic: string | null;
  decrypting: boolean;
  salt?: string;
  decryptionError?: string;
  encryptedMnemonic?: string;
  stxAddress?: string;
  publicKey?: string;
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
          // log.warn(
          //   'generateMnemonicSafe failed. Tried to create mnemonic when one already exists.'
          // );
          return state;
        }
        return { ...state, mnemonic: action.payload };
      })
      .addCase(persistMnemonic, (state, action) => ({ ...state, mnemonic: action.payload }))
      .addCase(setPasswordSuccess, (state, { payload }) => ({
        ...state,
        ...payload,
        mnemonic: null,
      }))
      .addCase(persistLedgerWallet, (state, { payload }) => ({
        ...state,
        stxAddress: payload.address,
        publicKey: payload.publicKey,
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
export const selectWalletType = createSelector(selectKeysSlice, state => state.walletType);
export const selectEncryptedMnemonic = createSelector(
  selectKeysSlice,
  state => state.encryptedMnemonic
);
export const selectAddress = createSelector(selectKeysSlice, state => state.stxAddress);
export const selectSalt = createSelector(selectKeysSlice, state => state.salt);
export const selectPublicKey = createSelector(selectKeysSlice, state =>
  state.publicKey ? Buffer.from(state.publicKey, 'hex') : null
);
