import { connectWebSocketClient, StacksApiWebSocketClient } from '@stacks/blockchain-api-client';
import { safeAwait } from '@utils/safe-await';
import { useEffect } from 'react';
import urljoin from 'url-join';
import { isDelegatedStackingTx, isRevokingDelegationTx, isDelegateStxTx } from '@utils/tx-utils';
import { useDelegationStatus } from './use-delegation-status';
import { useMempool } from './use-mempool';
import { useDispatch, useSelector } from 'react-redux';
import { selectAddress } from '@store/keys';
import { useApi } from './use-api';
import { updateAddressBalance } from '@store/address';
import { RootState } from '@store/index';
import { selectPoxInfo } from '@store/stacking';

export function useWebSocketIntegration() {
  const delegationStatus = useDelegationStatus();
  const mempool = useMempool();
  const dispatch = useDispatch();

  const { address, poxInfo } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    poxInfo: selectPoxInfo(state),
  }));

  const api = useApi();
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
          // commented out as not particularly needed given polling for new tx
          // dispatch(addNewTransaction(newTx.data));
          // dispatch(pendingTransactionSuccessful(newTx.data));
        });
      } catch {}
    }
    void run();
    return () => {
      if (client) client.webSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, dispatch, api, poxInfo?.contract_id]);
}
