import Store from 'electron-store';

const store = new Store({
  schema: {
    salt: {
      type: 'string',
      // maxLength: 29,
      // minLength: 29,
    },
    encryptedMnemonic: {
      type: 'string',
    },
  },
});

export const persistEncryptedMnemonic = (encryptedMnemonic: string) => {
  store.set('encryptedMnemonic', encryptedMnemonic);
};

export const persistSalt = (salt: string) => {
  store.set('salt', salt);
};

export const getInitialStateFromDisk = () => {
  return {
    salt: store.get('salt') as string,
    encryptedMnemonic: store.get('encryptedMnemonic') as string,
  };
};
