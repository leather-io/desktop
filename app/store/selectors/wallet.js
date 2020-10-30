import { microToStacks, stacksToMicro } from "@blockstack/stacks-utils";
import BigNumber from "bignumber.js"

const selectWalletHistory = state =>
  state.wallet.data ? state.wallet.data.history : [];

const selectWalletSeed = state => state.wallet.seed;

const selectWalletStacksAddress = state => state.wallet.addresses.stx;

const selectWalletBitcoinAddress = state => state.wallet.addresses.btc;

const selectWalletBitcoinBalance = state =>
  state.wallet.data &&
  state.wallet.data.balances &&
  state.wallet.data.balances.confirmed;

const selectWalletType = state => state.wallet.type;

const selectWalletBalance = state => state.wallet.balances.stx;

const selectWalletLoading = state => state.wallet.loading;

const selectWalletData = state => state.wallet.data;

const selectWalletError = state => state.wallet.error;

const selectWalletLastFetch = state => state.wallet.lastFetch;

const selectWalletIsFetchingBalances = state => state.wallet.fetchingBalances;

const selectWalletIsFetchingAddressData = state =>
  state.wallet.fetchingAddressData;

const selectWalletIsFetching = state => {
  const fetchingBalances = selectWalletIsFetchingBalances(state);
  const fetchingAddressData = selectWalletIsFetchingAddressData(state);

  return fetchingBalances || fetchingAddressData;
};

const selectPendingTxs = state =>
  state.wallet.data
    ? state.wallet.data.transactions.filter(tx => tx.pending && !tx.invalid)
    : [];

const selectRawTxs = state =>
  state.wallet.data ? state.wallet.data.transactions : [];

const selectPendingBalance = state => {
  const thisAddress = selectWalletStacksAddress(state);
  const balance = BigNumber(microToStacks(selectWalletBalance(state)));
  const pendingTxs = selectPendingTxs(state);

  let difference = BigNumber(0);

  if (pendingTxs && pendingTxs.length) {
    pendingTxs.forEach(tx => {
      const isSent = tx.sender === thisAddress;
      const amount = isSent
        ? BigNumber(tx.tokenAmountReadable).multipliedBy(-1)
        : BigNumber(tx.tokenAmountReadable);

      difference = difference.plus(amount)
    });
  }
  if (!difference.isEqualTo(0)) {
    return stacksToMicro(balance.plus(difference).toString())
  }
  return null;
};

export {
  selectWalletHistory,
  selectWalletSeed,
  selectWalletBalance,
  selectWalletStacksAddress,
  selectWalletType,
  selectWalletBitcoinAddress,
  selectWalletBitcoinBalance,
  selectWalletLoading,
  selectWalletData,
  selectWalletError,
  selectPendingTxs,
  selectRawTxs,
  selectWalletLastFetch,
  selectPendingBalance,
  selectWalletIsFetching
};
