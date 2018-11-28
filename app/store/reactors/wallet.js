import {
  selectWalletLastFetch,
  selectWalletIsFetching,
  selectWalletType
} from "@stores/selectors/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { doRefreshData } from "@stores/actions/wallet";
import { selectAppTime } from "@stores/selectors/app";
const ONE_MINUTE = 60 * 1000;
const staleAfter = ONE_MINUTE * 5;

const reactShouldRefreshData = store => {
  console.log("reactShouldRefreshData");
  const { getState, dispatch } = store;
  const state = getState();
  const type = selectWalletType(state);
  if (!type) return null; // if no type
  const appTime = selectAppTime(state);
  const lastFetch = selectWalletLastFetch(state);
  const isFetching = selectWalletIsFetching(state);

  if (!isFetching) {
    if (appTime - lastFetch > staleAfter) {
      return doRefreshData(false)(dispatch, getState);
    }
  }
};

export { reactShouldRefreshData };
