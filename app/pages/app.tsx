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
import { useInterval } from '@hooks/use-interval';
import { watchContractExecution } from '@api/watch-contract-execution';
import {
  fetchBlockTimeInfo,
  fetchCoreDetails,
  fetchStackerInfo,
  fetchStackingInfo,
  removeStackingTx,
  selectPoxInfo,
  selectActiveStackingTxId,
} from '@store/stacking';
import { isDelegatedStackingTx, isRevokingDelegationTx, isDelegateStxTx } from '@utils/tx-utils';

import { useApi } from '@hooks/use-api';
import { useDelegationStatus } from '@hooks/use-delegation-status';
import { useMempool } from '@hooks/use-mempool';

export const App: FC = ({ children }) => {
  const dispatch = useDispatch();
  const api = useApi();

  const { address, activeStackingTx, poxInfo } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    activeStackingTx: selectActiveStackingTxId(state),
    poxInfo: selectPoxInfo(state),
  }));

  const delegationStatus = useDelegationStatus();
  const mempool = useMempool();

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
  }, [address, api, initAppWithStxAddressInfo, dispatch]);

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
      await safeAwait(watchContractExecution({ nodeUrl: api.baseUrl, txId: activeStackingTx }));
      dispatch(fetchStackerInfo(address));
      setTimeout(() => dispatch(removeStackingTx()), 2000);
    }

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStackingTx]);

  useEffect(() => {
    const wsUrl = new URL(api.baseUrl);
    wsUrl.protocol = 'ws:';
    let client: null | StacksApiWebSocketClient;

    async function run() {
      try {
        if (!address) return;
        client = await connectWebSocketClient(urljoin(wsUrl.toString(), 'extended', 'v1', 'ws'));
        await client.subscribeAddressBalanceUpdates(address, async ({ address, balance }) => {
          await safeAwait(mempool.refetch());
          dispatch(updateAddressBalance({ address, balance }));
        });
        await client.subscribeAddressTransactions(address, async ({ tx_id }) => {
          const newTx = await api.getTxDetails(tx_id);
          if (
            isDelegatedStackingTx(newTx.data, poxInfo?.contract_id) ||
            isRevokingDelegationTx(newTx.data, poxInfo?.contract_id) ||
            isDelegateStxTx(newTx.data, poxInfo?.contract_id)
          ) {
            await safeAwait(delegationStatus.refetch());
          }
          if (newTx.data.tx_status !== 'success') return;
          dispatch(addNewTransaction(newTx.data));
          dispatch(pendingTransactionSuccessful(newTx.data));
        });
      } catch {}
    }
    void run();
    return () => {
      if (client) client.webSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, dispatch, api, poxInfo?.contract_id]);

  return (
    <>
      <TitleBar />
      {children}
      <VersionInfo />
    </>
  );
};
