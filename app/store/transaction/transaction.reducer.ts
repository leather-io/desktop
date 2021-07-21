import { createEntityAdapter, EntityState, createReducer, createSelector } from '@reduxjs/toolkit';
import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import { RootState } from '..';
import {
  fetchTransactionsFail,
  addNewTransaction,
  fetchTransactionsDone,
  pendingTransactionSuccessful,
  broadcastTx,
  fetchTransactions,
} from './transaction.actions';

export interface TransactionState extends EntityState<AddressTransactionWithTransfers> {
  mostRecentBroadcastError: string | null;
  fetchTxError: string | null;
  loading: boolean;
}

const transactionAdapter = createEntityAdapter<AddressTransactionWithTransfers>({
  selectId: ({ tx }) => tx.tx_id,
  sortComparer: (tx1, tx2) => {
    if (tx1.tx.is_unanchored) return -1;
    return tx2.tx.burn_block_time - tx1.tx.burn_block_time;
  },
});

const initialState = transactionAdapter.getInitialState({
  mostRecentBroadcastError: null as string | null,
  fetchTxError: null as string | null,
  loading: true,
});

export const transactionReducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchTransactions, (state, action) => ({
      ...state,
      fetchTxError: null,
      loading: action.payload.displayLoading ?? true,
    }))
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

export const selectTransactionList = (state: RootState) => selectors.selectAll(state);

export const selectTransactionsLoading = createSelector(selectTxState, state => state.loading);

export const selectTransactionListFetchError = createSelector(
  selectTxState,
  state => state.fetchTxError
);
