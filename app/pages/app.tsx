import React, { useCallback, useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import urljoin from 'url-join';
import { connectWebSocketClient, StacksApiWebSocketClient } from '@stacks/blockchain-api-client';
import { useNavigatorOnline } from '@hooks/use-navigator-online';
import { VersionInfo } from '@components/version-info';
import {
  getAddressTransactions,
  addNewTransaction,
  pendingTransactionSuccessful,
} from '@store/transaction';
import { DEFAULT_POLLING_INTERVAL } from '@constants/index';
import { getAddressDetails, updateAddressBalance } from '@store/address';
import { RootState } from '@store/index';
import { TitleBar } from '@components/title-bar/title-bar';
import { selectAddress } from '@store/keys';
import { safeAwait } from '@utils/safe-await';
import { Api } from '@api/api';
import { selectActiveNodeApi } from '@store/stacks-node';
import { useInterval } from '@hooks/use-interval';
import { watchContractExecution } from '@api/watch-contract-execution';
import { useDelegationStatus } from '@hooks/use-delegation-status';
import {
  fetchBlockTimeInfo,
  fetchCoreDetails,
  fetchStackerInfo,
  fetchStackingInfo,
  removeStackingTx,
  selectActiveStackingTxId,
} from '@store/stacking';
import { SWRConfig } from 'swr';
import { isDelegatedStackingTx, isRevokingDelegationTx, isDelegateStxTx } from '../utils/tx-utils';
import { selectPoxInfo } from '../store/stacking/stacking.reducer';

export const App: FC = ({ children }) => {
  const dispatch = useDispatch();

  const { address, activeNode, activeStackingTx, poxInfo } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    activeNode: selectActiveNodeApi(state),
    activeStackingTx: selectActiveStackingTxId(state),
    poxInfo: selectPoxInfo(state),
  }));

  const { update: updateDelegationStatus } = useDelegationStatus();

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

  useNavigatorOnline({ onReconnect: initAppWithStxAddressInfo });

  useInterval(() => refreshWalletDetailsWithoutLoader(), DEFAULT_POLLING_INTERVAL);

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
        if (
          isDelegatedStackingTx(newTx.data, poxInfo?.contract_id) ||
          isRevokingDelegationTx(newTx.data, poxInfo?.contract_id) ||
          isDelegateStxTx(newTx.data, poxInfo?.contract_id)
        ) {
          void updateDelegationStatus();
        }
        if (newTx.data.tx_status !== 'success') return;
        dispatch(addNewTransaction(newTx.data));
        dispatch(pendingTransactionSuccessful(newTx.data));
      });
    }

    void run();
    return () => {
      if (client) client.webSocket.close();
    };
  }, [address, dispatch, activeNode.url, updateDelegationStatus, poxInfo?.contract_id]);

  return (
    <SWRConfig value={{ refreshInterval: DEFAULT_POLLING_INTERVAL }}>
      <TitleBar />
      {children}
      <VersionInfo />
    </SWRConfig>
  );
};
