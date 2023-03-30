export const reduxPersistElectronStore = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    getItem: async (key: any) => main.store.get(key),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setItem: async (key: any, item: any) => main.store.set(key, item),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    removeItem: async (key: any) => main.store.delete(key),
  };
};
