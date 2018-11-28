// src: https://github.com/HenrikJoreteg/redux-persist-middleware
const IS_BROWSER = !!(
  typeof window !== "undefined" || typeof self !== "undefined"
);
const fallback = cb => setTimeout(cb, 0);
const ric =
  typeof requestIdleCallback === "undefined" ? fallback : requestIdleCallback;

export default ({ cacheFn, actionMap, logger }) => ({
  getState
}) => next => action => {
  const reducersToPersist = actionMap[action.type];
  const res = next(action);
  const state = getState();
  if (IS_BROWSER && reducersToPersist && reducersToPersist.length) {
    ric(
      () => {
        Promise.all(
          reducersToPersist.map(key => cacheFn(key, state[key]))
        ).then(() => {
          if (logger) {
            logger(
              `cached ${reducersToPersist.join(", ")} due to ${action.type}`
            );
          }
        });
      },
      { timeout: 100 }
    );
  }
  return res;
};
