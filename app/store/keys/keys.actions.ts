import { useHistory } from 'react-router';
import { push } from 'connected-react-router';
import { createAction, Dispatch } from '@reduxjs/toolkit';
// import log from 'electron-log';
import { generateMnemonicRootKeychain, deriveRootKeychainFromMnemonic } from '@stacks/keychain';

import { RootState } from '..';
import routes from '@constants/routes.json';
import { MNEMONIC_ENTROPY } from '@constants/index';
import {
  persistSalt,
  persistEncryptedMnemonic,
  persistStxAddress,
  persistWalletType,
  persistPublicKey,
} from '@utils/disk-store';
import { generateSalt } from '../../crypto/key-generation';
import { deriveStxAddressKeychain } from '../../crypto/derive-address-keychain';
import { encryptMnemonic, decryptMnemonic } from '../../crypto/key-encryption';

import { selectMnemonic } from './keys.reducer';
import { BIP32Interface } from '../../types/bip32';

type History = ReturnType<typeof useHistory>;

export const persistMnemonicSafe = createAction<string>('keys/save-mnemonic-safe');

export const persistMnemonic = createAction<string>('keys/save-mnemonic');

interface PersistLedgerWalletAction {
  address: string;
  publicKey: string;
}
export const persistLedgerWallet = createAction<PersistLedgerWalletAction>(
  'keys/persist-ledger-wallet'
);

interface SetLedgerAddress {
  address: string;
  publicKey: Buffer;
  onSuccess: () => void;
}
export function setLedgerWallet({ address, publicKey, onSuccess }: SetLedgerAddress) {
  return (dispatch: Dispatch) => {
    persistStxAddress(address);
    persistPublicKey(publicKey.toString('hex'));
    persistWalletType('ledger');
    dispatch(persistLedgerWallet({ address, publicKey: publicKey.toString('hex') }));
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

interface SetSoftwareWallet {
  password: string;
  history: History;
}
export function setSoftwareWallet({ password, history }: SetSoftwareWallet) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const mnemonic = selectMnemonic(getState());
    const salt = generateSalt();
    const { derivedKeyHash } = await api.deriveKey({ pass: password, salt });

    if (!mnemonic) {
      // log.error('Cannot derive encryption key unless a mnemonic has been generated');
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

interface DecryptSoftwareWalletArgs {
  password: string;
  salt: string;
  ciphertextMnemonic: string;
}
export async function decryptSoftwareWallet(args: DecryptSoftwareWalletArgs) {
  const { password, salt, ciphertextMnemonic } = args;
  const { derivedKeyHash } = await api.deriveKey({ pass: password, salt });
  const plaintextMnemonic = await decryptMnemonic({
    encryptedMnemonic: ciphertextMnemonic,
    derivedKeyHash,
  });
  const rootNode = await deriveRootKeychainFromMnemonic(plaintextMnemonic);
  return deriveStxAddressKeychain(rootNode) as {
    childKey: BIP32Interface;
    address: string;
    privateKey: string;
  };
}
