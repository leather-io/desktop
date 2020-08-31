import Store from 'electron-store';

interface ReduxPersistElectronStore {
  electronStore?: Store;
  electronStoreOpts?: Store;
}

export const reduxPersistElectronStore = (args: ReduxPersistElectronStore = {}) => {
  const { electronStore, electronStoreOpts } = args;

  const store = electronStore || new Store((electronStoreOpts as any) || {});

  return {
    getItem: (key: any) => Promise.resolve(store.get(key)),

    setItem: (key: any, item: any) => Promise.resolve(store.set(key, item)),

    removeItem: (key: any) => Promise.resolve(store.delete(key)),
  };
};
