import { push } from 'connected-react-router';
import { createAction, Dispatch } from '@reduxjs/toolkit';
import { useHistory } from 'react-router';
import bcryptjs from 'bcryptjs';
import { memoizeWith, identity } from 'ramda';
import { generateMnemonicRootKeychain } from '@blockstack/keychain';
import { encryptMnemonic, decryptMnemonic } from 'blockstack';

import routes from '../../constants/routes.json';
import { MNEMONIC_ENTROPY } from '../../constants';
import { RootState } from '../index';
import { persistSalt, persistEncryptedMnemonic } from '../../utils/disk-store';
import { safeAwait } from '../../utils/safe-await';
import log from 'electron-log';
import { selectMnemonic } from './keys.reducer';

type History = ReturnType<typeof useHistory>;

export const persistMnemonicSafe = createAction<string>('keys/save-mnemonic-safe');

export const persistMnemonic = createAction<string>('keys/save-mnemonic');

export const addData = createAction<any>('keys/add-all');

interface SetPasswordSuccess {
  salt: string;
  encryptedMnemonic: string;
}
export const setPasswordSuccess = createAction<SetPasswordSuccess>('keys/set-password-success');

export function onboardingMnemonicGenerationStep({ stepDelayMs }: { stepDelayMs: string }) {
  return async (dispatch: Dispatch) => {
    const key = await generateMnemonicRootKeychain(MNEMONIC_ENTROPY);
    dispatch(persistMnemonicSafe(key.plaintextMnemonic));
    setTimeout(() => dispatch(push(routes.SECRET_KEY)), stepDelayMs);
  };
}

// 980aa096dd224bd69685583b363de2be
export async function generateDerivedKey({ password, salt }: { password: string; salt: string }) {
  return bcryptjs.hash(password, salt);
}

const generateSalt = memoizeWith(identity, async () => await bcryptjs.genSalt(12));

export function setPassword({ password, history }: { password: string; history: History }) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const mnemonic = selectMnemonic(state);
    const salt = await generateSalt();

    const derivedEncryptionKey = await generateDerivedKey({ password, salt });
    if (!mnemonic) {
      log.error('Cannot derive encryption key unless a mnemonic has been generated');
      return;
    }
    const encryptedMnemonicBuffer = await encryptMnemonic(mnemonic, derivedEncryptionKey);
    const encryptedMnemonic = encryptedMnemonicBuffer.toString('hex');
    // TEMP: to remove, useful for debugging
    dispatch(setPasswordSuccess({ salt, encryptedMnemonic }));
    persistSalt(salt);
    persistEncryptedMnemonic(encryptedMnemonic);
    history.push(routes.HOME);
  };
}

export const attemptWalletDecrypt = createAction('keys/attempt-wallet-decrypt');
export const attemptWalletDecryptSuccess = createAction<{ salt: string; mnemonic: string }>(
  'keys/attempt-wallet-decrypt-success'
);
export const attemptWalletDecryptFailed = createAction<{ decryptionError: string }>(
  'keys/attempt-wallet-decrypt-failed'
);

export function decryptWallet({ password, history }: { password: string; history: History }) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(attemptWalletDecrypt());
    const salt = (getState().keys as any).salt as string;
    const encryptedMnemonic = (getState().keys as any).encryptedMnemonic as string;
    const key = await generateDerivedKey({ password, salt });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const [error, mnemonic] = await safeAwait(decryptMnemonic(encryptedMnemonic, key));

    if (error) {
      dispatch(attemptWalletDecryptFailed({ decryptionError: 'Password incorrect' }));
      return;
    }

    if (mnemonic) {
      history.push(routes.HOME);
      dispatch(attemptWalletDecryptSuccess({ salt, mnemonic }));
    }
  };
}
