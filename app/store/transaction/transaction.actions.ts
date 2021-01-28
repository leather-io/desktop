import { createAction } from '@reduxjs/toolkit';
import { safeAwait } from '@blockstack/ui';
import {
  Transaction,
  PostCoreNodeTransactionsError,
} from '@blockstack/stacks-blockchain-api-types';
import urljoin from 'url-join';
import { StacksTransaction, TxBroadcastResult } from '@stacks/transactions';

import { Api } from '../../api/api';
import { stacksNetwork } from '../../environment';
import { safelyFormatHexTxid } from '@utils/safe-handle-txid';
import { Dispatch, GetState } from '@store/index';
import { selectActiveNodeApi } from '@store/stacks-node';

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

export interface BroadcastTransactionArgs {
  transaction: StacksTransaction;
  onBroadcastSuccess(txId: string): void;
  onBroadcastFail(errorResponse?: PostCoreNodeTransactionsError): void;
}
export function broadcastTransaction(args: BroadcastTransactionArgs) {
  const { transaction, onBroadcastSuccess, onBroadcastFail } = args;
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(broadcastTx());

    const activeNode = selectActiveNodeApi(getState());
    stacksNetwork.coreApiUrl = activeNode.url;

    try {
      const blockchainResponse = await broadcastRawTransaction(
        transaction.serialize(),
        activeNode.url
      );
      if (typeof blockchainResponse !== 'string') {
        // setError for ui
        dispatch(broadcastTxFail(blockchainResponse as any));
        onBroadcastFail(blockchainResponse);
        return;
      }
      onBroadcastSuccess(safelyFormatHexTxid(blockchainResponse));
      return blockchainResponse;
    } catch (e) {
      dispatch(broadcastTxFail(e));
      onBroadcastFail();
      return;
    }
  };
}

export async function broadcastRawTransaction(
  rawTx: Buffer,
  url: string
): Promise<TxBroadcastResult> {
  const requestHeaders = {
    'Content-Type': 'application/octet-stream',
  };

  const options = {
    method: 'POST',
    headers: requestHeaders,
    body: rawTx,
  };

  const response = await fetch(urljoin(url, '/v2/transactions'), options);
  const text = await response.text();

  try {
    return JSON.parse(text) as TxBroadcastResult;
  } catch (e) {
    return text;
  }
}
