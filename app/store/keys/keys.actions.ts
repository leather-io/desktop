import { useHistory } from 'react-router';
import { push } from 'connected-react-router';
import { createAction, Dispatch } from '@reduxjs/toolkit';
import log from 'electron-log';
import {
  generateMnemonicRootKeychain,
  deriveRootKeychainFromMnemonic,
  deriveStxAddressChain,
} from '@blockstack/keychain';
import { encryptMnemonic, decryptMnemonic } from 'blockstack';
import { ChainID } from '@blockstack/stacks-transactions';

import { RootState } from '..';
import routes from '../../constants/routes.json';
import { MNEMONIC_ENTROPY } from '../../constants';
import { persistSalt, persistEncryptedMnemonic } from '../../utils/disk-store';
import { safeAwait } from '../../utils/safe-await';
import { selectMnemonic, selectKeysSlice } from './keys.reducer';
import { generateSalt, generateDerivedKey } from '../../crypto/key-generation';

type History = ReturnType<typeof useHistory>;

export const persistMnemonicSafe = createAction<string>('keys/save-mnemonic-safe');

export const persistMnemonic = createAction<string>('keys/save-mnemonic');

interface SetPasswordSuccess {
  salt: string;
  encryptedMnemonic: string;
}
export const setPasswordSuccess = createAction<SetPasswordSuccess>('keys/set-password-success');

export function onboardingMnemonicGenerationStep({ stepDelayMs }: { stepDelayMs: number }) {
  return async (dispatch: Dispatch) => {
    const key = await generateMnemonicRootKeychain(MNEMONIC_ENTROPY);
    dispatch(persistMnemonicSafe(key.plaintextMnemonic));
    setTimeout(() => dispatch(push(routes.SECRET_KEY)), stepDelayMs);
  };
}

export function setPassword({ password, history }: { password: string; history: History }) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const mnemonic = selectMnemonic(getState());
    const salt = await generateSalt();
    const derivedEncryptionKey = await generateDerivedKey({ password, salt });

    if (!mnemonic) {
      log.error('Cannot derive encryption key unless a mnemonic has been generated');
      return;
    }

    const encryptedMnemonicBuffer = await encryptMnemonic(mnemonic, derivedEncryptionKey);
    const encryptedMnemonic = encryptedMnemonicBuffer.toString('hex');
    persistSalt(salt);
    persistEncryptedMnemonic(encryptedMnemonic);
    dispatch(setPasswordSuccess({ salt, encryptedMnemonic }));
    history.push(routes.HOME);
  };
}

export const attemptWalletDecrypt = createAction('keys/attempt-wallet-decrypt');
export const attemptWalletDecryptSuccess = createAction<{
  salt: string;
  mnemonic: string;
  address: string;
}>('keys/attempt-wallet-decrypt-success');
export const attemptWalletDecryptFailed = createAction<{ decryptionError: string }>(
  'keys/attempt-wallet-decrypt-failed'
);

export function decryptWallet({ password, history }: { password: string; history: History }) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(attemptWalletDecrypt());
    const { salt, encryptedMnemonic } = selectKeysSlice(getState());

    if (!salt || !encryptedMnemonic) {
      log.error('Cannot decrypt wallet if no `salt` or `encryptedMnemonic` exists');
      return;
    }

    const key = await generateDerivedKey({ password, salt });

    //
    // TODO: remove casting within blockstack.js library
    // https://github.com/blockstack/blockstack.js/pull/797
    const [error, mnemonic] = await safeAwait(
      decryptMnemonic(encryptedMnemonic, key, undefined as any)
    );

    if (error) {
      dispatch(attemptWalletDecryptFailed({ decryptionError: 'Password incorrect' }));
      return;
    }

    if (mnemonic) {
      const { rootNode } = await deriveRootKeychainFromMnemonic(mnemonic, '');
      console.log({ rootNode });
      const { address } = deriveStxAddressChain(ChainID.Mainnet)(rootNode);
      dispatch(attemptWalletDecryptSuccess({ salt, mnemonic, address }));
      history.push(routes.HOME);
    }
  };
}
