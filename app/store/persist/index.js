import Store from "electron-store";
import getPersistMiddleware from "./getPersistMiddleware";
import {
  ADD_WALLET_ADDRESS,
  FETCH_ADDRESS_DATA_FINISHED,
  FETCH_BALANCES_FINISHED
} from "../reducers/wallet";

const storage = ({ electronStore, electronStoreOpts } = {}) => {
  const store = electronStore || new Store(electronStoreOpts || {});
  return {
    get: key =>
      new Promise(resolve => {
        resolve(store.get(key));
      }),
    set: (key, item) =>
      new Promise(resolve => {
        // Prevent seed from being persisted to disk
        var filteredItem = { ...item };
        if (key === "wallet") {
          filteredItem.seed = null;
        }
        resolve(store.set(key, filteredItem));
      }),
    remove: key =>
      new Promise(resolve => {
        resolve(store.delete(key));
      })
  };
};

const keysToWatch = ["wallet", "router", "app"];
// A mapping of actions to reducers we should
// persist after those actions occur
const actionMap = {
  [ADD_WALLET_ADDRESS]: keysToWatch,
  [FETCH_ADDRESS_DATA_FINISHED]: keysToWatch,
  [FETCH_BALANCES_FINISHED]: keysToWatch
};
// Configure our middleware
const persistMiddleware = () =>
  getPersistMiddleware({
    // a function to call to persist stuff.
    // This *must* return a Promise and
    // *must take two arguments: (key, value)*
    cacheFn: storage().set,
    // optionally logs out which action triggered
    // something to be cached and what reducers
    // were persisted as a result.
    logger: console.info,
    // We pass in the mapping of action types to
    // reducers that should be persisted
    actionMap
  });

const clearCache = async () =>
  Promise.all(keysToWatch.map(async key => storage().remove(key)));

const getAll = async () => {
  const data = {};
  await Promise.all(
    keysToWatch.map(async key => {
      data[key] = await storage().get(key);
    })
  );
  return data;
};

export { persistMiddleware, getAll, clearCache };
