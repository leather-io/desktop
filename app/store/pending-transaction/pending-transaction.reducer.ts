import { createEntityAdapter, EntityState, createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';
import type { pendingTransactionSuccessful } from '../transaction';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

export interface PendingTransaction extends Pick<Transaction, 'tx_id'> {
  amount: string;
  time: number;
}

export type PendingTransactionState = EntityState<PendingTransaction>;

const pendingTransactionAdapter = createEntityAdapter<PendingTransaction>({
  selectId: pendingTx => pendingTx.tx_id,
  sortComparer: (pTx1, pTx2) => pTx2.time - pTx1.time,
});

const initialState = pendingTransactionAdapter.getInitialState();

const pendingTransactionSlice = createSlice({
  name: 'pendingTransactions',
  initialState,
  reducers: {
    addPendingTransaction: pendingTransactionAdapter.addOne,
    removePendingTransaction: pendingTransactionAdapter.removeOne,
  },
  extraReducers: {
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

export const addPendingTransaction = pendingTransactionSlice.actions.addPendingTransaction;
export const removePendingTransaction = pendingTransactionSlice.actions.removePendingTransaction;
