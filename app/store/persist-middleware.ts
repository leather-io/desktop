export const reduxPersistElectronStore = () => {
  return {
    getItem: (key: any) => Promise.resolve(main.store.get(key)),
    setItem: (key: any, item: any) => Promise.resolve(main.store.set(key, item)),
    removeItem: (key: any) => Promise.resolve(main.store.delete(key)),
  };
};
