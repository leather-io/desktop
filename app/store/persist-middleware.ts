// import Store from 'electron-store';

interface ReduxPersistElectronStore {
  // electronStore?: Store;
  // electronStoreOpts?: Store;
  electronStore?: any;
  electronStoreOpts?: any;
}

export const reduxPersistElectronStore = (args: ReduxPersistElectronStore = {}) => {
  // const { electronStore, electronStoreOpts } = args;

  // const store = electronStore || new Store((electronStoreOpts as any) || {});

  // return {
  //   getItem: (key: any) => Promise.resolve(store.get(key)),

  //   setItem: (key: any, item: any) => Promise.resolve(store.set(key, item)),

  //   removeItem: (key: any) => Promise.resolve(store.delete(key)),
  // };

  return {
    getItem: (key: any) => Promise.resolve(),

    setItem: (key: any, item: any) => Promise.resolve(),

    removeItem: (key: any) => Promise.resolve(),
  };
};
