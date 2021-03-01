export const reduxPersistElectronStore = () => {
  return {
    getItem: async (key: any) => main.store.get(key),
    setItem: async (key: any, item: any) => main.store.set(key, item),
    removeItem: async (key: any) => main.store.delete(key),
  };
};
