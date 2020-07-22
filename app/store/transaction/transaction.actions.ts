import { shell } from 'electron';
import { createAction } from '@reduxjs/toolkit';
import { safeAwait } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

import { broadcastTransaction, StacksTransaction } from '@blockstack/stacks-transactions';

import { Dispatch } from '../index';
import { Api } from '../../api/api';

import { stacksNetwork } from '../../environment';

export const pendingTransactionSuccessful = createAction<Transaction>(
  'transactions/pending-transaction-successful'
);

const fetchTxName = 'transactions/fetch-transactions';
export const fetchTransactions = createAction(fetchTxName);
export const fetchTransactionsDone = createAction<Transaction[]>(fetchTxName + '-done');
export const fetchTransactionsFail = createAction(fetchTxName + '-fail');

export function getAddressTransactions(address: string) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTransactions());
    const [error, response] = await safeAwait(Api.getAddressTransactions(address));
    if (error) {
      dispatch(fetchTransactionsFail());
      return;
    }
    if (response) {
      const transactions = response.data.results;
      dispatch(fetchTransactionsDone(transactions));
    }
  };
}

export const broadcastTx = createAction('transactions/broadcast-transactions');
export const broadcastTxDone = createAction('transactions/broadcast-transactions-done');
export const broadcastTxFail = createAction('transactions/broadcast-transactions-fail');

export async function openInExplorer(txId: string) {
  return await shell.openExternal(
    `https://testnet-explorer.blockstack.org/txid/${txId}?wallet=true`
  );
}
