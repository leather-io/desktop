const selectWalletHistory = state =>
  state.wallet.data && state.wallet.data.history;

const selectWalletStacksAddress = state =>
  state.wallet.data && state.wallet.data.history;

const selectWalletBitcoinAddress = state =>
  state.wallet.data && state.wallet.data.history;

const selectWalletType = state => state.wallet.type;

const selectWalletBalance = state =>
  state.wallet.data && state.wallet.data.balance;

const selectWalletLoading = state => state.wallet.loading;

const selectWalletError = state => state.wallet.error;
