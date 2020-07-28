import { createEntityAdapter, EntityState, createReducer } from '@reduxjs/toolkit';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

import { RootState } from '..';
import { fetchTransactionsDone, pendingTransactionSuccessful } from './transaction.actions';

export type TransactionState = EntityState<Transaction>;

const transactionAdapter = createEntityAdapter<Transaction>({
  selectId: transaction => transaction.tx_id,
  sortComparer: (tx1, tx2) => tx2.burn_block_time - tx1.burn_block_time,
});

const initialState = transactionAdapter.getInitialState();

export const transactionReducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchTransactionsDone, transactionAdapter.addMany)
    .addCase(pendingTransactionSuccessful, transactionAdapter.addOne)
);

const selectTransactionState = (state: RootState) => state.transaction;
const selectors = transactionAdapter.getSelectors(selectTransactionState);

export const selectTransactions = selectors.selectAll;
