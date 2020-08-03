import { useHistory } from 'react-router';
import { push } from 'connected-react-router';
import { createAction, Dispatch } from '@reduxjs/toolkit';
import log from 'electron-log';
import { generateMnemonicRootKeychain, deriveRootKeychainFromMnemonic } from '@blockstack/keychain';

import { RootState } from '..';
import routes from '../../constants/routes.json';
import { MNEMONIC_ENTROPY } from '../../constants';
import {
  persistSalt,
  persistEncryptedMnemonic,
  persistStxAddress,
  persistWalletType,
} from '../../utils/disk-store';
import { safeAwait } from '../../utils/safe-await';
import { selectMnemonic, selectKeysSlice } from './keys.reducer';
import { generateSalt, deriveKey } from '../../crypto/key-generation';
import { deriveStxAddressKeychain } from '../../crypto/derive-address-keychain';
import { encryptMnemonic, decryptMnemonic } from '../../crypto/key-encryption';
import { delay } from '../../utils/delay';

type History = ReturnType<typeof useHistory>;

export const persistMnemonicSafe = createAction<string>('keys/save-mnemonic-safe');

export const persistMnemonic = createAction<string>('keys/save-mnemonic');

export const updateLedgerAddress = createAction<string>('keys/set-ledger-address');

interface SetLedgerAddress {
  address: string;
  onSuccess: () => void;
}
export function setLedgerAddress({ address, onSuccess }: SetLedgerAddress) {
  return async (dispatch: Dispatch) => {
    await delay(1000);
    persistStxAddress(address);
    persistWalletType('ledger');
    dispatch(updateLedgerAddress(address));
    onSuccess();
  };
}

interface SetPasswordSuccess {
  salt: string;
  encryptedMnemonic: string;
  address: string;
}

export const setPasswordSuccess = createAction<SetPasswordSuccess>('keys/set-password-success');

export function onboardingMnemonicGenerationStep({ stepDelayMs }: { stepDelayMs: number }) {
  return async (dispatch: Dispatch) => {
    const key = await generateMnemonicRootKeychain(MNEMONIC_ENTROPY);
    dispatch(persistMnemonicSafe(key.plaintextMnemonic));
    setTimeout(() => dispatch(push(routes.SECRET_KEY)), stepDelayMs);
  };
}

interface SetSoftwareWalletPassword {
  password: string;
  history: History;
}
export function setSoftwareWalletPassword({ password, history }: SetSoftwareWalletPassword) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const mnemonic = selectMnemonic(getState());
    const salt = generateSalt();
    const { derivedKeyHash } = await deriveKey({ pass: password, salt });

    if (!mnemonic) {
      log.error('Cannot derive encryption key unless a mnemonic has been generated');
      return;
    }

    const encryptedMnemonic = await encryptMnemonic({ derivedKeyHash, mnemonic });
    const rootNode = await deriveRootKeychainFromMnemonic(mnemonic);
    const { address } = deriveStxAddressKeychain(rootNode);
    persistSalt(salt);
    persistEncryptedMnemonic(encryptedMnemonic);
    persistStxAddress(address);
    dispatch(setPasswordSuccess({ salt, encryptedMnemonic, address }));
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

interface DecryptWallet {
  password: string;
  onDecryptSuccess: () => void;
}
export function decryptWallet({ password, onDecryptSuccess }: DecryptWallet) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(attemptWalletDecrypt());
    const { salt, encryptedMnemonic } = selectKeysSlice(getState());

    if (!salt || !encryptedMnemonic) {
      log.error('Cannot decrypt wallet if no `salt` or `encryptedMnemonic` exists');
      return;
    }

    const { derivedKeyHash } = await deriveKey({ pass: password, salt });

    const [error, mnemonic] = await safeAwait(
      decryptMnemonic({ encryptedMnemonic, derivedKeyHash })
    );

    if (error) {
      dispatch(attemptWalletDecryptFailed({ decryptionError: 'Password incorrect' }));
      return;
    }

    if (mnemonic) {
      const rootNode = await deriveRootKeychainFromMnemonic(mnemonic);
      const { address } = deriveStxAddressKeychain(rootNode);
      dispatch(attemptWalletDecryptSuccess({ salt, mnemonic, address }));
      onDecryptSuccess();
    }
  };
}
