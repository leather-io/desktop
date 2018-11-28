import { ric } from "@common/utils";
import { IS_BROWSER, IS_PROD } from "@common/constants";

/**
 * getPersistMiddleware
 *
 * Redux persist middleware
 * src: https://github.com/HenrikJoreteg/redux-persist-middleware
 */
const getPersistMiddleware = ({ cacheFn, actionMap, logger }) => ({
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
          if (logger && !IS_PROD) {
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

export default getPersistMiddleware;
