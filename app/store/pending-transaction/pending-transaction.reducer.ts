import {
  createEntityAdapter,
  EntityState,
  createSlice,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';

import { RootState } from '..';
import { fetchTransactionsDone, pendingTransactionSuccessful } from '../transaction';
import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';

export type PendingTransactionState = EntityState<MempoolTransaction>;

const pendingTransactionAdapter = createEntityAdapter<MempoolTransaction>({
  selectId: pendingTx => pendingTx.tx_id,
  sortComparer: (pTx1, pTx2) => pTx2.receipt_time - pTx1.receipt_time,
});

const initialState = pendingTransactionAdapter.getInitialState();

export const pendingTransactionSlice = createSlice({
  name: 'pendingTransactions',
  initialState,
  reducers: {
    addPendingTransaction: pendingTransactionAdapter.addOne,
    removePendingTransaction: pendingTransactionAdapter.removeOne,
  },
  extraReducers: {
    [fetchTransactionsDone.toString()]: (state, action: PayloadAction<Transaction[]>) => {
      if (state.ids.length === 0) return;
      state.ids.forEach(pendingId => {
        if (action.payload.map(tx => tx.tx_id).includes(pendingId as string)) {
          pendingTransactionAdapter.removeOne(state, pendingId);
        }
      });
    },
    // cannot import owing to circular dependency
    'transactions/pending-transaction-successful': (
      state,
      action: ReturnType<typeof pendingTransactionSuccessful>
    ) => pendingTransactionAdapter.removeOne(state, action.payload.tx_id),
  },
});

export const pendingTransactionReducer = pendingTransactionSlice.reducer;

const selectPendingTransactionState = (state: RootState) => state.pendingTransaction;
const selectors = pendingTransactionAdapter.getSelectors(selectPendingTransactionState);

export const selectPendingTransactions = selectors.selectAll;
export const selectIsStackingCallPending = createSelector(selectors.selectAll, state =>
  state.some(tx => (tx as any).isStackingCall)
);

export const addPendingTransaction = pendingTransactionSlice.actions.addPendingTransaction;
export const removePendingTransaction = pendingTransactionSlice.actions.removePendingTransaction;
