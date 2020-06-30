import { createEntityAdapter, EntityState, createReducer } from '@reduxjs/toolkit';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

import { RootState } from '..';
import { fetchTransactionsDone } from './transaction.actions';

export type TransactionState = EntityState<Transaction>;

const transactionAdapter = createEntityAdapter<Transaction>({
  selectId: transaction => transaction.tx_id,
});

const initialState = transactionAdapter.getInitialState();

export const transactionReducer = createReducer(initialState, builder =>
  builder.addCase(fetchTransactionsDone, transactionAdapter.addMany)
);

const selectors = transactionAdapter.getSelectors<RootState>(state => state.transaction);

export const selectTransactions = selectors.selectAll;
