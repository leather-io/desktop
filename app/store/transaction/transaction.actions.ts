import { createAction } from '@reduxjs/toolkit';
import { safeAwait } from '@blockstack/ui';
import {
  Transaction,
  PostCoreNodeTransactionsError,
} from '@blockstack/stacks-blockchain-api-types';
import urljoin from 'url-join';
import BigNumber from 'bignumber.js';
import { StacksTransaction, TxBroadcastResult } from '@stacks/transactions';

import { Api } from '../../api/api';
import { stacksNetwork } from '../../environment';
import { safelyFormatHexTxid } from '@utils/safe-handle-txid';
import { addPendingTransaction } from '@store/pending-transaction';
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
  amount: BigNumber;
  isStackingCall?: boolean;
  onBroadcastSuccess(txId: string): void;
  onBroadcastFail(errorResponse?: PostCoreNodeTransactionsError): void;
}
export function broadcastTransaction(args: BroadcastTransactionArgs) {
  const { amount, transaction, isStackingCall = false, onBroadcastSuccess, onBroadcastFail } = args;
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(broadcastTx());

    const activeNode = selectActiveNodeApi(getState());
    stacksNetwork.coreApiUrl = activeNode.url;

    const [error, blockchainResponse] = await safeAwait(
      broadcastRawTransaction(transaction.serialize(), activeNode.url)
    );
    console.log({ error, blockchainResponse });
    if (error || !blockchainResponse) {
      dispatch(broadcastTxFail(error as any));
      onBroadcastFail();
      return;
    }
    if (typeof blockchainResponse !== 'string') {
      // setError for ui
      dispatch(broadcastTxFail(blockchainResponse as any));
      onBroadcastFail(blockchainResponse);
      return;
    }
    onBroadcastSuccess(safelyFormatHexTxid(blockchainResponse));
    dispatch(
      addPendingTransaction({
        tx_id: safelyFormatHexTxid(blockchainResponse),
        amount: amount.toString(),
        time: +new Date(),
        isStackingCall,
      })
    );
    return blockchainResponse;
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
