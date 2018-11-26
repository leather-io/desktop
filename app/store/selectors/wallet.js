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

const selectPendingTxs = state =>
  state.wallet.data ? state.wallet.data.pendingTxs : [];

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
  selectPendingTxs
};
