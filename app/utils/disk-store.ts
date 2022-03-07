import { WalletType } from '../models/wallet-type';

enum StoreIndex {
  Salt = 'salt',
  EncryptedMnemonic = 'encryptedMnemonic',
  PublicKey = 'publicKey',
  WalletType = 'walletType',
  SignedIn = 'signedIn',
}

interface SoftwareWallet {
  [StoreIndex.WalletType]: 'software';
  [StoreIndex.Salt]: string;
  [StoreIndex.EncryptedMnemonic]: string;
  [StoreIndex.SignedIn]: boolean;
}

interface LedgerWallet {
  [StoreIndex.WalletType]: 'ledger';
  [StoreIndex.PublicKey]: string;
  [StoreIndex.SignedIn]: boolean;
}

export type DiskStore = LedgerWallet | SoftwareWallet;

export const persistEncryptedMnemonic = async (encryptedMnemonic: string) => {
  return main.store.set(StoreIndex.EncryptedMnemonic, encryptedMnemonic);
};

export const persistPublicKey = async (publicKey: string) => {
  return main.store.set(StoreIndex.PublicKey, publicKey);
};

export const persistSalt = async (salt: string) => {
  return main.store.set(StoreIndex.Salt, salt);
};

export const persistWalletType = async (walletType: WalletType) => {
  return main.store.set(StoreIndex.WalletType, walletType);
};

export const persistSignedIn = async () => {
  return main.store.set(StoreIndex.SignedIn, true);
};

export const getInitialStateFromDisk = () => {
  return main.store.initialValue() as unknown as DiskStore;
};

export const clearDiskStorage = async () => main.store.clear();
