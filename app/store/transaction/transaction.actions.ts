import { createAction } from '@reduxjs/toolkit';
import { safeAwait } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';
import BigNumber from 'bignumber.js';
import { broadcastTransaction, StacksTransaction } from '@blockstack/stacks-transactions';

import { Api } from '../../api/api';
import { stacksNetwork } from '../../environment';
import { safelyFormatHexTxid } from '@utils/safe-handle-txid';
import { addPendingTransaction } from '../pending-transaction';
import { Dispatch, GetState } from '../index';
import { selectActiveNodeApi } from '../stacks-node/stacks-node.reducer';

export const pendingTransactionSuccessful = createAction<Transaction>(
  'transactions/pending-transaction-successful'
);

export const addNewTransaction = createAction<Transaction>('transactions/new-transaction');

const fetchTxName = 'transactions/fetch-transactions';
export const fetchTransactions = createAction<{ displayLoading?: boolean }>(fetchTxName);
export const fetchTransactionsDone = createAction<Transaction[]>(fetchTxName + '-done');
export const fetchTransactionsFail = createAction<string>(fetchTxName + '-fail');

export function getAddressTransactions(
  address: string,
  options: { displayLoading?: boolean } = {}
) {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(fetchTransactions(options));
    const activeNode = selectActiveNodeApi(getState());
    const client = new Api(activeNode.url);
    const [error, response] = await safeAwait(client.getAddressTransactions(address));
    if (error) {
      dispatch(fetchTransactionsFail('Unable to fetch recent transactions'));
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
interface BroadcastTxFail {
  reason: string;
  message: string;
}
export const broadcastTxFail = createAction<BroadcastTxFail>(
  'transactions/broadcast-transactions-fail'
);

interface BroadcastStxTransactionArgs {
  signedTx: StacksTransaction;
  amount: BigNumber;
  onBroadcastSuccess: () => void;
  onBroadcastFail: () => void;
}
export function broadcastStxTransaction(args: BroadcastStxTransactionArgs) {
  const { amount, signedTx, onBroadcastSuccess, onBroadcastFail } = args;
  return async (dispatch: Dispatch) => {
    dispatch(broadcastTx());

    const [error, blockchainResponse] = await safeAwait(
      broadcastTransaction(signedTx, stacksNetwork)
    );
    if (error || !blockchainResponse) {
      dispatch(broadcastTxFail(error as any));
      return;
    }
    if (typeof blockchainResponse !== 'string') {
      // setError for ui
      dispatch(broadcastTxFail(error as any));
      onBroadcastFail();
      return;
    }
    onBroadcastSuccess();
    dispatch(
      addPendingTransaction({
        tx_id: safelyFormatHexTxid(blockchainResponse),
        amount: amount.toString(),
        time: +new Date(),
      })
    );
    return blockchainResponse;
  };
}
