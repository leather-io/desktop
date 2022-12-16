import { useHistory } from 'react-router';
import { push } from 'connected-react-router';
import { createAction, Dispatch } from '@reduxjs/toolkit';
import { generateSecretKey, DerivationType, getStxAddress } from '@stacks/wallet-sdk';
import { deriveAccount } from '@stacks/wallet-sdk/dist/derive';

import { RootState } from '..';
import * as bip39 from '@scure/bip39';
import routes from '@constants/routes.json';

import { TRANSACTION_VERSION, MNEMONIC_ENTROPY } from '@constants/index';
import {
  persistSalt,
  persistEncryptedMnemonic,
  persistStxAddress,
  persistWalletType,
  persistPublicKey,
} from '@utils/disk-store';
import { generateSalt } from '../../crypto/key-generation';
import { encryptMnemonic, decryptMnemonic } from '../../crypto/key-encryption';
import { HDKey } from '@scure/bip32';
import { selectMnemonic } from './keys.reducer';

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
  publicKey: string;
  onSuccess: () => void;
}
export function setLedgerWallet({ address, publicKey, onSuccess }: SetLedgerAddress) {
  return async (dispatch: Dispatch) => {
    await Promise.all([
      persistStxAddress(address),
      persistPublicKey(publicKey),
      persistWalletType('ledger'),
    ]);
    dispatch(persistLedgerWallet({ address, publicKey }));
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
    const plaintextMnemonic = generateSecretKey(MNEMONIC_ENTROPY);
    dispatch(persistMnemonicSafe(plaintextMnemonic));
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
    const { derivedKeyHash } = await main.deriveKey({ pass: password, salt });

    if (!mnemonic) return;

    const encryptedMnemonic = await encryptMnemonic({ derivedKeyHash, mnemonic });
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const rootNode = HDKey.fromMasterSeed(seed);
    const account = deriveAccount({
      rootNode,
      index: 0,
      salt,
      stxDerivationType: DerivationType.Wallet,
    });
    const address = getStxAddress({ account, transactionVersion: TRANSACTION_VERSION });
    await Promise.all([
      persistStxAddress(address),
      persistSalt(salt),
      persistEncryptedMnemonic(encryptedMnemonic),
    ]);
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
  const { derivedKeyHash } = await main.deriveKey({ pass: password, salt });
  const plaintextMnemonic = await decryptMnemonic({
    encryptedMnemonic: ciphertextMnemonic,
    derivedKeyHash,
  });
  const seed = await bip39.mnemonicToSeed(plaintextMnemonic);
  const rootNode = HDKey.fromMasterSeed(seed);
  return deriveAccount({ rootNode, index: 0, salt, stxDerivationType: DerivationType.Wallet });
  // as {
  //   childKey: BIP32Interface;
  //   address: string;
  //   privateKey: string;
  // };
}
