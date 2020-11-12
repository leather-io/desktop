import { WalletType } from '../types/wallet-type';

enum StoreIndex {
  Salt = 'salt',
  EncryptedMnemonic = 'encryptedMnemonic',
  StxAddress = 'stxAddress',
  PublicKey = 'publicKey',
  WalletType = 'walletType',
}

interface SoftwareWallet {
  [StoreIndex.WalletType]: 'software';
  [StoreIndex.Salt]: string;
  [StoreIndex.EncryptedMnemonic]: string;
  [StoreIndex.StxAddress]: string;
}

interface LedgerWallet {
  [StoreIndex.WalletType]: 'ledger';
  [StoreIndex.StxAddress]: string;
  [StoreIndex.PublicKey]: string;
}

export type DiskStore = LedgerWallet | SoftwareWallet;

export const persistEncryptedMnemonic = (encryptedMnemonic: string) => {
  api.store.set(StoreIndex.EncryptedMnemonic, encryptedMnemonic);
};

export const persistStxAddress = (stxAddress: string) => {
  api.store.set(StoreIndex.StxAddress, stxAddress);
};

export const persistPublicKey = (publicKey: string) => {
  api.store.set(StoreIndex.PublicKey, publicKey);
};

export const persistSalt = (salt: string) => {
  api.store.set(StoreIndex.Salt, salt);
};

export const persistWalletType = (walletType: WalletType) => {
  api.store.set(StoreIndex.WalletType, walletType);
};

export const getInitialStateFromDisk = () => {
  console.log('getting entire disk store', api.store.initialValue);
  return (api.store.initialValue as unknown) as DiskStore;
};

export const clearDiskStorage = () => api.store.clear();
