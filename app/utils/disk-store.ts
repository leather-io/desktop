import Store from 'electron-store';

const store = new Store();

export const persistEncryptedMnemonic = (encryptedMnemonic: string) => {
  store.set('encryptedMnemonic', encryptedMnemonic);
};

export const persistSalt = (salt: string) => {
  store.set('salt', salt);
};

export const getPrivateKey = () => (store.get('privateKey') || null) as string | null;

export const getInitialStateFromDisk = () => {
  return {
    salt: store.get('salt') as string,
    encryptedMnemonic: store.get('encryptedMnemonic') as string,
  };
};
