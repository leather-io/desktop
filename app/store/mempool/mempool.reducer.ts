import { createEntityAdapter, EntityState, createReducer } from '@reduxjs/toolkit';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';

import { RootState } from '..';
import { fetchMempoolTxs } from './mempool.actions';

export interface MempoolState extends EntityState<MempoolTransaction> {
  loading: boolean;
}

const mempoolAdapter = createEntityAdapter<MempoolTransaction>({
  selectId: transaction => transaction.tx_id,
});

const initialState = mempoolAdapter.getInitialState({
  loading: true,
});

export const mempoolReducer = createReducer(initialState, builder =>
  builder.addCase(fetchMempoolTxs.fulfilled, (state, action) => {
    mempoolAdapter.removeAll(state);
    mempoolAdapter.addMany(state, action.payload as any);
  })
);

const selectMempoolState = (state: RootState) => state.mempool;
const selectors = mempoolAdapter.getSelectors(selectMempoolState);
export const selectMempoolTxs = selectors.selectAll;
