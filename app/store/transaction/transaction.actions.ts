import { createAction } from '@reduxjs/toolkit';
import { safeAwait } from '@stacks/ui';
import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';

import urljoin from 'url-join';
import { StacksTransaction, TxBroadcastResultRejected } from '@stacks/transactions';

import { Api } from '../../api/api';
import { safelyFormatHexTxid } from '@utils/safe-handle-txid';
import { Dispatch, GetState } from '@store/index';
import { selectActiveNodeApi, selectActiveStacksNetwork } from '@store/stacks-node';
import { isObject } from 'formik';

export const pendingTransactionSuccessful = createAction<AddressTransactionWithTransfers>(
  'transactions/pending-transaction-successful'
);

export const addNewTransaction = createAction<AddressTransactionWithTransfers>(
  'transactions/new-transaction'
);

const fetchTxName = 'transactions/fetch-transactions';
export const fetchTransactions = createAction<{ displayLoading?: boolean }>(fetchTxName);
export const fetchTransactionsDone = createAction<AddressTransactionWithTransfers[]>(
  fetchTxName + '-done'
);
export const fetchTransactionsFail = createAction<string>(fetchTxName + '-fail');

export function getAddressTransactions(
  address: string,
  options: { displayLoading?: boolean } = {}
) {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(fetchTransactions(options));
    const activeNode = selectActiveNodeApi(getState());
    const client = new Api(activeNode.url);
    const [error, response] = await safeAwait(client.getAddressTransactionsWithTransfers(address));
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

function hasMessageProp(arg: unknown): arg is { message: string } {
  if (!isObject(arg)) return false;
  if (!Object.hasOwn(arg, 'message')) return false;

  return true;
}
export interface BroadcastTransactionArgs {
  transaction: StacksTransaction;
  onBroadcastSuccess(txId: string): void;
  onBroadcastFail(errorResponse?: TxBroadcastResultRejected): void;
}
export function broadcastTransaction(args: BroadcastTransactionArgs) {
  const { transaction, onBroadcastSuccess, onBroadcastFail } = args;
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch(broadcastTx());

    const activeNode = selectActiveStacksNetwork(getState());

    try {
      const blockchainResponse = await broadcastRawTransaction(
        transaction.serialize(),
        activeNode.coreApiUrl
      );
      if (typeof blockchainResponse !== 'string') {
        // setError for ui
        const reasonData = blockchainResponse.reason_data;
        const message = hasMessageProp(reasonData) ? reasonData.message : '';
        dispatch(
          broadcastTxFail({
            reason: blockchainResponse.reason,
            message,
          })
        );
        onBroadcastFail(blockchainResponse);
        return;
      }
      onBroadcastSuccess(safelyFormatHexTxid(blockchainResponse));
      return blockchainResponse;
    } catch (e) {
      dispatch(broadcastTxFail(e as BroadcastTxFail));
      onBroadcastFail();
      return;
    }
  };
}

export async function broadcastRawTransaction(
  rawTx: Uint8Array,
  url: string
): Promise<TxBroadcastResultRejected | string> {
  const requestHeaders = {
    'Content-Type': 'application/octet-stream',
  };

  const options = {
    method: 'POST',
    headers: requestHeaders,
    body: rawTx,
  };

  const response = await fetch(urljoin(url, '/v2/transactions'), options);

  /**
   * Variable `text` can either be,
   * - a string of the transaction id, when the request is successful
   * - a stringified JSON object when the request is unsuccessful
   *
   * source,
   * https://docs.hiro.so/api#tag/Transactions/operation/post_core_node_transactions
   *
   * Note that in the documentation above the mimetype of successful responses
   * is documented as `text/plain`, yet the responses have have a mimetype of
   * `application/json`.
   */
  const text = await response.text();
  return JSON.parse(text);
}
