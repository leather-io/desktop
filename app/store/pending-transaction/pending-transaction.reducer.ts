import { createEntityAdapter, EntityState, createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';
import { pendingTransactionSuccessful } from '../transaction';

export interface PendingTransaction {
  txId: string;
  amount: string;
  time: number;
}

export type PendingTransactionState = EntityState<PendingTransaction>;

const pendingTransactionAdapter = createEntityAdapter<PendingTransaction>({
  selectId: pendingTx => pendingTx.txId,
  sortComparer: (pTx1, pTx2) => pTx2.time - pTx1.time,
});

const initialState = pendingTransactionAdapter.getInitialState({
  //
  // TODO: remove demo content when faucet is working
  // ids: ['58bc2c34c70184e36023d55eda7e3fd17c695833c3b4fdc0187cd09d929c15e201'],
  // entities: {
  //   '58bc2c34c70184e36023d55eda7e3fd17c695833c3b4fdc0187cd09d929c15e201': {
  //     txId: '58bc2c34c70184e36023d55eda7e3fd17c695833c3b4fdc0187cd09d929c15e201',
  //     time: 2342342,
  //     amount: '384',
  //   } as PendingTransaction,
  // },
});

const pendingTransactionSlice = createSlice({
  name: 'pendingTransactions',
  initialState,
  reducers: {
    addPendingTransaction: pendingTransactionAdapter.addOne,
    removePendingTransaction: pendingTransactionAdapter.removeOne,
  },
  extraReducers: {
    [pendingTransactionSuccessful.type]: (
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
