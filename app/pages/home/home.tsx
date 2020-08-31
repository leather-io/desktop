import React, { useEffect, FC, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@blockstack/ui';
import { useHotkeys } from 'react-hotkeys-hook';

import { RootState } from '../../store';
import { connectWebSocketClient } from '@stacks/blockchain-api-client';
import {
  getAddressTransactions,
  addNewTransaction,
} from '../../store/transaction/transaction.actions';
import { openInExplorer } from '../../utils/external-links';
import { selectAddress } from '../../store/keys/keys.reducer';
import { getAddressDetails, updateAddressBalance } from '../../store/address/address.actions';
import { selectAddressBalance } from '../../store/address/address.reducer';
import {
  selectTransactionList,
  selectTransactionsLoading,
} from '../../store/transaction/transaction.reducer';
import { selectPendingTransactions } from '../../store/pending-transaction/pending-transaction.reducer';
import {
  homeActions,
  selectTxModalOpen,
  selectReceiveModalOpen,
} from '../../store/home/home.reducer';
import {
  TransactionList,
  StackingPromoCard,
  StackingRewardCard,
  TransactionListItem,
  BalanceCard,
} from '../../components/home';
import { TransactionModal } from '../../modals/transaction/transaction-modal';
import { ReceiveStxModal } from '../../modals/receive-stx/receive-stx-modal';
import { useInterval } from '../../hooks/use-interval';
import { TransactionListItemPending } from '../../components/home/transaction-list/transaction-list-item-pending';
import { pendingTransactionSuccessful } from '../../store/transaction/transaction.actions';
import { Api } from '../../api/api';
import { safelyFormatHexTxid } from '../../utils/safe-handle-txid';
import { safeAwait } from '../../utils/safe-await';
import { HomeLayout } from './home-layout';
import { increment, decrement } from '../../utils/mutate-numbers';
import { useNavigatorOnline } from '../../hooks/use-navigator-online';
import { useCallback } from 'react';

export const Home: FC = () => {
  const dispatch = useDispatch();
  const {
    address,
    balance,
    txs,
    pendingTxs,
    loadingTxs,
    txModalOpen,
    receiveModalOpen,
  } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    txs: selectTransactionList(state),
    pendingTxs: selectPendingTransactions(state),
    balance: selectAddressBalance(state),
    txModalOpen: selectTxModalOpen(state),
    receiveModalOpen: selectReceiveModalOpen(state),
    loadingTxs: selectTransactionsLoading(state),
  }));

  const [webSocket, setWebSocket] = useState('Disconnected');

  const focusedTxIdRef = useRef<string | null>(null);
  const txDomNodeRefMap = useRef<{ [txId: string]: HTMLButtonElement }>({});

  const focusTxDomNode = (shift: (i: number) => number) => {
    const allTxs = [...pendingTxs, ...txs];
    if (allTxs.length === 0) return;
    if (focusedTxIdRef.current === null) {
      const txId = allTxs[0].tx_id;
      focusedTxIdRef.current = txId;
      txDomNodeRefMap.current[txId].focus();
      return;
    }
    const nextIndex = shift(allTxs.findIndex(tx => tx.tx_id === focusedTxIdRef.current));
    const nextTx = allTxs[nextIndex];
    if (!nextTx) return;
    const domNode = txDomNodeRefMap.current[nextTx.tx_id];
    if (!domNode) return;
    domNode.focus();
  };

  useHotkeys('j', () => focusTxDomNode(increment), [txs, pendingTxs]);
  useHotkeys('k', () => focusTxDomNode(decrement), [txs, pendingTxs]);

  const checkIfPendingTxIsComplete = async (address: string) => {
    const [error, txResponse] = await safeAwait(Api.getTxDetails(address));
    if (error || !txResponse || txResponse.data.tx_status === 'pending') {
      return;
    }
    if (txResponse.data.tx_status === 'success') {
      dispatch(pendingTransactionSuccessful(txResponse.data));
    }
  };

  const connectWebSocket = async () => {
    return connectWebSocketClient(
      'ws://stacks-node-api-latest.argon.blockstack.xyz/extended/v1/ws'
    );
  };

  useEffect(() => {
    async function run() {
      const client = await connectWebSocket().finally(() => {
        setWebSocket('Disconnected');
      });
      setWebSocket('Connected');
      if (!address) return;
      await client.subscribeAddressBalanceUpdates(address, ({ address, balance }) => {
        console.log('address balance updates', { address, balance });
        dispatch(updateAddressBalance({ address, balance }));
      });
      await client.subscribeAddressTransactions(address, async ({ tx_id }) => {
        console.log('address tx updates', tx_id);
        const newTx = await Api.getTxDetails(tx_id);
        if (newTx.data.tx_status !== 'success') return;
        dispatch(addNewTransaction(newTx.data));
      });
    }
    void run();
  }, [address, dispatch]);

  if (!address) return <Spinner />;

  const transactionList = (
    <>
      <TransactionList txCount={txs.length + pendingTxs.length} loading={loadingTxs}>
        {pendingTxs.map(pTx => (
          <TransactionListItemPending
            domNodeMapRef={txDomNodeRefMap}
            activeTxIdRef={focusedTxIdRef}
            key={pTx.tx_id}
            tx={pTx}
            onSelectTx={openInExplorer}
          />
        ))}
        {txs.map(tx => (
          <TransactionListItem
            domNodeMapRef={txDomNodeRefMap}
            activeTxIdRef={focusedTxIdRef}
            key={tx.tx_id}
            tx={tx}
            address={address}
            onSelectTx={openInExplorer}
          />
        ))}
      </TransactionList>
    </>
  );
  const balanceCard = (
    <BalanceCard
      balance={balance}
      onSelectSend={() => dispatch(homeActions.openTxModal())}
      onSelectReceive={() => dispatch(homeActions.openReceiveModal())}
      onRequestTestnetStx={async () => Api.getFaucetStx(address)}
    />
  );
  const stackingPromoCard = <StackingPromoCard />;
  const stackingRewardCard = (
    <StackingRewardCard lifetime="0.0281 Bitcoin (sample)" lastCycle="0.000383 Bitcoin (sample)" />
  );

  return (
    <>
      {receiveModalOpen && <ReceiveStxModal address={address} />}
      {txModalOpen && <TransactionModal balance={balance || '0'} address={address} />}
      <HomeLayout
        transactionList={transactionList}
        balanceCard={balanceCard}
        stackingPromoCard={stackingPromoCard}
        stackingRewardCard={stackingRewardCard}
      />
    </>
  );
};
