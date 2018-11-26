const selectWalletHistory = state =>
  state.wallet.data ? state.wallet.data.history : [];

const selectWalletStacksAddress = state => state.wallet.addresses.stx;

const selectWalletBitcoinAddress = state => state.wallet.addresses.btc;

const selectWalletBitcoinBalance = state => state.wallet.balances.btc;

const selectWalletType = state => state.wallet.type;

const selectWalletBalance = state => state.wallet.balances.stx;

const selectWalletLoading = state => state.wallet.loading;

const selectWalletData = state => state.wallet.data;

const selectWalletError = state => state.wallet.error;

const selectWalletLastFetch = state => state.wallet.lastFetch;

const selectPendingTxs = state =>
  state.wallet.data ? state.wallet.data.pendingTxs : [];

const selectRawTxs = state =>
  state.wallet.data ? state.wallet.data.transactions : [];

export {
  selectWalletHistory,
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
  selectWalletLastFetch
};
