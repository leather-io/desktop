import Store from 'electron-store';

enum PersistedValues {
  Salt = 'salt',
  EncryptedMnemonic = 'encryptedMnemonic',
  StxAddress = 'stxAddress',
  WalletType = 'walletType',
}

export interface DiskStore {
  [PersistedValues.Salt]?: string;
  [PersistedValues.EncryptedMnemonic]?: string;
  [PersistedValues.WalletType]: 'ledger' | 'software';
  [PersistedValues.StxAddress]: string;
}

const store = new Store({
  schema: {
    [PersistedValues.Salt]: {
      type: 'string',
      minLength: 32,
      maxLength: 32,
    },
    [PersistedValues.EncryptedMnemonic]: {
      type: 'string',
    },
    [PersistedValues.StxAddress]: {
      type: 'string',
    },
    [PersistedValues.WalletType]: {
      enum: ['ledger', 'software'],
    },
  },
});

export const persistEncryptedMnemonic = (encryptedMnemonic: string) => {
  store.set(PersistedValues.EncryptedMnemonic, encryptedMnemonic);
};

export const persistStxAddress = (stxAddress: string) => {
  store.set(PersistedValues.StxAddress, stxAddress);
};

export const persistSalt = (salt: string) => {
  store.set(PersistedValues.Salt, salt);
};

export const persistWalletType = (walletType: 'ledger' | 'software') => {
  store.set(PersistedValues.WalletType, walletType);
};

export const getInitialStateFromDisk = () => {
  return store.store as DiskStore;
};
