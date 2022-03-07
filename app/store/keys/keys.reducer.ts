import { createReducer, createSelector } from '@reduxjs/toolkit';

import { RootState } from '..';
import { WalletType } from '@models/wallet-type';
import {
  setPasswordSuccess,
  persistLedgerWallet,
  persistMnemonicSafe,
  persistMnemonic,
  setPublicKey,
} from './keys.actions';
import { AddressVersion, publicKeyFromBuffer, publicKeyToAddress } from '@stacks/transactions';

export interface KeysState {
  walletType: WalletType;
  mnemonic: string | null;
  decrypting: boolean;
  salt?: string;
  decryptionError?: string;
  encryptedMnemonic?: string;
  publicKey?: string;
  /**
   * @deprecated we now persist publicKey and derive address from it.
   */
  stxAddress?: string;
  signedIn: boolean;
}

const initialState: Readonly<KeysState> = Object.freeze({
  mnemonic: null,
  decrypting: false,
  walletType: 'software',
  signedIn: false,
});

const addressVersionMap = {
  mainnet: AddressVersion.MainnetSingleSig,
  testnet: AddressVersion.TestnetSingleSig,
};

export const createKeysReducer = (keys: Partial<KeysState> = {}) => {
  const signedIn = !!keys.stxAddress || !!keys.signedIn; // handle legacy state
  return createReducer({ ...initialState, ...keys, signedIn: signedIn }, builder =>
    builder
      .addCase(persistMnemonicSafe, (state, action) => {
        if (state.mnemonic !== null) {
          return state;
        }
        return { ...state, mnemonic: action.payload };
      })
      .addCase(persistMnemonic, (state, action) => ({ ...state, mnemonic: action.payload }))
      .addCase(setPublicKey, (state, action) => ({ ...state, publicKey: action.payload }))
      .addCase(setPasswordSuccess, (state, { payload }) => ({
        ...state,
        ...payload,
        mnemonic: null,
        signedIn: true,
      }))
      .addCase(persistLedgerWallet, (state, { payload }) => ({
        ...state,
        publicKey: payload.publicKey,
        walletType: 'ledger',
        signedIn: true,
      }))
  );
};

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
export const selectSalt = createSelector(selectKeysSlice, state => state.salt);
export const selectPublicKey = createSelector(selectKeysSlice, state =>
  state.publicKey ? Buffer.from(state.publicKey, 'hex') : null
);
export const selectAddress = createSelector(selectPublicKey, publicKey =>
  publicKey
    ? publicKeyToAddress(
        addressVersionMap[process.env.STX_NETWORK as keyof typeof addressVersionMap],
        publicKeyFromBuffer(publicKey)
      )
    : undefined
);
export const selectSignedIn = createSelector(selectKeysSlice, state => state.signedIn);
