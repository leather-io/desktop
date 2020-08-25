import { createEntityAdapter, EntityState, createReducer, createSelector } from '@reduxjs/toolkit';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

import { RootState } from '..';
import {
  fetchTransactionsDone,
  pendingTransactionSuccessful,
  broadcastTx,
} from './transaction.actions';

export interface TransactionState extends EntityState<Transaction> {
  mostRecentBroadcastError: null | string;
}

const transactionAdapter = createEntityAdapter<Transaction>({
  selectId: transaction => transaction.tx_id,
  sortComparer: (tx1, tx2) => tx2.burn_block_time - tx1.burn_block_time,
});

const initialState = transactionAdapter.getInitialState({
  mostRecentBroadcastError: null,
});

export const transactionReducer = createReducer(initialState, builder =>
  builder
    .addCase(broadcastTx, state => ({ ...state, mostRecentBroadcastError: null }))
    .addCase(fetchTransactionsDone, transactionAdapter.addMany)
    .addCase(pendingTransactionSuccessful, transactionAdapter.addOne)
);

const selectTxState = (state: RootState) => state.transaction;
const selectors = transactionAdapter.getSelectors(selectTxState);

export const selectTransactionList = selectors.selectAll;
export const selectMostRecentlyTxError = createSelector(
  selectTxState,
  state => state.mostRecentBroadcastError
);
