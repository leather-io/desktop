import Store from 'electron-store';
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

// const store = new Store({
//   schema: {
//     [StoreIndex.Salt]: {
//       type: 'string',
//       minLength: 32,
//       maxLength: 32,
//     },
//     [StoreIndex.EncryptedMnemonic]: {
//       type: 'string',
//     },
//     [StoreIndex.StxAddress]: {
//       type: 'string',
//     },
//     [StoreIndex.PublicKey]: {
//       type: 'string',
//       minLength: 66,
//       maxLength: 66,
//     },
//     [StoreIndex.WalletType]: {
//       enum: ['ledger', 'software'],
//     },
//   },
// });

export const persistEncryptedMnemonic = (encryptedMnemonic: string) => {
  // store.set(StoreIndex.EncryptedMnemonic, encryptedMnemonic);
};

export const persistStxAddress = (stxAddress: string) => {
  // store.set(StoreIndex.StxAddress, stxAddress);
};

export const persistPublicKey = (publicKey: string) => {
  // store.set(StoreIndex.PublicKey, publicKey);
};

export const persistSalt = (salt: string) => {
  // store.set(StoreIndex.Salt, salt);
};

export const persistWalletType = (walletType: WalletType) => {
  // store.set(StoreIndex.WalletType, walletType);
};

export const getInitialStateFromDisk = () => {
  // return store.store as DiskStore;
};

export const clearDiskStorage = () => {}; //store.clear();
