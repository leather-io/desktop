import { createEntityAdapter, EntityState, createReducer, createSelector } from '@reduxjs/toolkit';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

import { RootState } from '..';
import { fetchTransactionsDone, addPendingTransaction } from './transaction.actions';

export interface TransactionState extends EntityState<Transaction> {
  pending: string[];
}

const transactionAdapter = createEntityAdapter<Transaction>({
  selectId: transaction => transaction.tx_id,
  sortComparer: (tx1, tx2) => tx2.burn_block_time - tx1.burn_block_time,
});

const initialState = transactionAdapter.getInitialState({
  pending: [] as string[],
});

export const transactionReducer = createReducer(initialState, builder =>
  builder
    // .addCase(fetchTransactionsDone, )
    .addCase(fetchTransactionsDone, (state, action) => {
      transactionAdapter.addMany(state, action);
      console.log(state.pending);
      state.pending = state.pending.filter(
        id => !action.payload.some(tx => tx.tx_id.replace('0x', '') === id)
      );
    })
    .addCase(addPendingTransaction, (state, action) => ({
      ...state,
      pending: [...state.pending, action.payload],
    }))
);

const selectTransactionState = (state: RootState) => state.transaction;
const selectors = transactionAdapter.getSelectors(selectTransactionState);

export const selectTransactions = selectors.selectAll;
export const selectPendingTransactions = createSelector(
  selectTransactionState,
  state => state.pending
);
