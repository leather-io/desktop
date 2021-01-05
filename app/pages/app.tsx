import React, { useCallback, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import urljoin from 'url-join';
import { connectWebSocketClient, StacksApiWebSocketClient } from '@stacks/blockchain-api-client';
import { useNavigatorOnline } from '@hooks/use-navigator-online';
import { BetaNotice } from '@components/beta-notice';
import {
  getAddressTransactions,
  addNewTransaction,
  pendingTransactionSuccessful,
} from '@store/transaction';
import { getAddressDetails, updateAddressBalance } from '@store/address';
import { RootState } from '@store/index';
import { TitleBar } from '@components/title-bar/title-bar';
import { selectAddress } from '@store/keys';
import { safeAwait } from '@utils/safe-await';
import { Api } from '@api/api';
import { selectActiveNodeApi } from '@store/stacks-node';
import { useInterval } from '@hooks/use-interval';
import { selectPendingTransactions } from '@store/pending-transaction';
import { watchContractExecution } from '../api/watch-contract-execution';
import {
  fetchBlockTimeInfo,
  fetchCoreDetails,
  fetchStackerInfo,
  fetchStackingInfo,
  removeStackingTx,
  selectActiveStackingTxId,
} from '@store/stacking';

export const App: FC = ({ children }) => {
  const dispatch = useDispatch();

  const { address, activeNode, pendingTxs, activeStackingTx } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    activeNode: selectActiveNodeApi(state),
    pendingTxs: selectPendingTransactions(state),
    activeStackingTx: selectActiveStackingTxId(state),
  }));

  const initAppWithStxAddressInfo = useCallback(() => {
    if (!address) return;
    dispatch(getAddressTransactions(address));
    dispatch(getAddressDetails(address));
  }, [address, dispatch]);

  const refreshWalletDetailsWithoutLoader = useCallback(() => {
    if (!address) return;
    dispatch(getAddressTransactions(address, { displayLoading: false }));
    dispatch(getAddressDetails(address));
  }, [address, dispatch]);

  const checkIfPendingTxIsComplete = async (txId: string) => {
    const [error, txResponse] = await safeAwait(new Api(activeNode.url).getTxDetails(txId));
    if (error || !txResponse || txResponse.data.tx_status === 'pending') {
      return;
    }
    if (txResponse.data.tx_status !== ('pending' as any)) {
      dispatch(pendingTransactionSuccessful(txResponse.data));
    }
  };

  useNavigatorOnline({ onReconnect: initAppWithStxAddressInfo });

  useInterval(() => refreshWalletDetailsWithoutLoader(), 60_000);

  useInterval(() => pendingTxs.forEach(tx => void checkIfPendingTxIsComplete(tx.tx_id)), 15_000);

  useEffect(() => {
    initAppWithStxAddressInfo();
    if (address) {
      dispatch(fetchStackingInfo());
      dispatch(fetchCoreDetails());
      dispatch(fetchBlockTimeInfo());
      dispatch(fetchStackerInfo(address));
    }
  }, [address, activeNode, initAppWithStxAddressInfo, dispatch]);

  useInterval(() => {
    if (address) {
      dispatch(fetchStackerInfo(address));
      dispatch(fetchStackingInfo());
    }
    dispatch(fetchCoreDetails());
  }, 20_000);

  useEffect(() => {
    async function run() {
      if (!activeStackingTx || !address) return;
      await safeAwait(watchContractExecution({ nodeUrl: activeNode.url, txId: activeStackingTx }));
      dispatch(fetchStackerInfo(address));
      setTimeout(() => dispatch(removeStackingTx()), 2000);
    }
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStackingTx]);

  useEffect(() => {
    const wsUrl = new URL(activeNode.url);
    wsUrl.protocol = 'ws:';
    let client: null | StacksApiWebSocketClient;
    async function run() {
      client = await connectWebSocketClient(urljoin(wsUrl.toString(), 'extended', 'v1', 'ws'));
      if (!address) return;
      await client.subscribeAddressBalanceUpdates(address, ({ address, balance }) => {
        dispatch(updateAddressBalance({ address, balance }));
      });
      await client.subscribeAddressTransactions(address, async ({ tx_id }) => {
        const newTx = await new Api(activeNode.url).getTxDetails(tx_id);
        if (newTx.data.tx_status !== 'success') return;
        dispatch(addNewTransaction(newTx.data));
        dispatch(pendingTransactionSuccessful(newTx.data));
      });
    }
    void run();
    return () => {
      if (client) client.webSocket.close();
    };
  }, [address, dispatch, activeNode.url]);

  return (
    <>
      <TitleBar />
      {children}
      <BetaNotice />
    </>
  );
};
