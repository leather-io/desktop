export const reduxPersistElectronStore = () => {
  return {
    getItem: (key: any) => Promise.resolve(api.store.get(key)),
    setItem: (key: any, item: any) => Promise.resolve(api.store.set(key, item)),
    removeItem: (key: any) => Promise.resolve(api.store.delete(key)),
  };
};
