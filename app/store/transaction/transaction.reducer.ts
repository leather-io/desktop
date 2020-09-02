import { createEntityAdapter, EntityState, createReducer, createSelector } from '@reduxjs/toolkit';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

import { RootState } from '..';
import {
  fetchTransactionsFail,
  addNewTransaction,
  fetchTransactionsDone,
  pendingTransactionSuccessful,
  broadcastTx,
  fetchTransactions,
} from './transaction.actions';

export interface TransactionState extends EntityState<Transaction> {
  mostRecentBroadcastError: string | null;
  fetchTxError: string | null;
  loading: boolean;
}

const transactionAdapter = createEntityAdapter<Transaction>({
  selectId: transaction => transaction.tx_id,
  sortComparer: (tx1, tx2) => tx2.burn_block_time - tx1.burn_block_time,
});

const initialState = transactionAdapter.getInitialState({
  mostRecentBroadcastError: null as string | null,
  fetchTxError: null as string | null,
  loading: true,
});

export const transactionReducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchTransactions, state => ({ ...state, fetchTxError: null, loading: true }))
    .addCase(broadcastTx, state => ({ ...state, mostRecentBroadcastError: null }))
    .addCase(fetchTransactionsDone, (state, action) => ({
      ...transactionAdapter.addMany({ ...state }, action),
      loading: false,
    }))
    .addCase(fetchTransactionsFail, (state, action) => ({
      ...state,
      loading: false,
      fetchTxError: action.payload,
    }))
    .addCase(pendingTransactionSuccessful, transactionAdapter.addOne)
    .addCase(addNewTransaction, transactionAdapter.addOne)
);

const selectTxState = (state: RootState) => state.transaction;
const selectors = transactionAdapter.getSelectors(selectTxState);

export const selectTransactionList = selectors.selectAll;
export const selectMostRecentlyTxError = createSelector(
  selectTxState,
  state => state.mostRecentBroadcastError
);
export const selectTransactionsLoading = createSelector(selectTxState, state => state.loading);
export const selectTransactionListFetchError = createSelector(
  selectTxState,
  state => state.fetchTxError
);
