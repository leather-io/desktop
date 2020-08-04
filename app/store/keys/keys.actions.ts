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
import { selectKeysSlice, selectMnemonic } from './keys.reducer';
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
  stxAddress: string;
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
    persistStxAddress(address);
    persistSalt(salt);
    persistEncryptedMnemonic(encryptedMnemonic);
    dispatch(setPasswordSuccess({ salt, encryptedMnemonic, stxAddress: address }));
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

interface DecryptSoftwareWalletArgs {
  password: string;
  salt: string;
  ciphertextMnemonic: string;
}
export async function decryptSoftwareWallet(args: DecryptSoftwareWalletArgs) {
  const { password, salt, ciphertextMnemonic } = args;
  const { derivedKeyHash } = await deriveKey({ pass: password, salt });
  const plaintextMnemonic = await decryptMnemonic({
    encryptedMnemonic: ciphertextMnemonic,
    derivedKeyHash,
  });
  const rootNode = await deriveRootKeychainFromMnemonic(plaintextMnemonic);
  return deriveStxAddressKeychain(rootNode);
}
