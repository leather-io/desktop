import React, { FC, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@blockstack/ui';
import { useHotkeys } from 'react-hotkeys-hook';

import { RootState } from '../../store';

import { openInExplorer } from '../../utils/external-links';
import { selectAddress } from '../../store/keys/keys.reducer';
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
import { TransactionListItemPending } from '../../components/home/transaction-list/transaction-list-item-pending';

import { Api } from '../../api/api';
import { HomeLayout } from './home-layout';
import { increment, decrement } from '../../utils/mutate-numbers';
import { selectActiveNodeApi } from '../../store/stacks-node/stacks-node.reducer';

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
    activeNode,
  } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    txs: selectTransactionList(state),
    pendingTxs: selectPendingTransactions(state),
    balance: selectAddressBalance(state),
    txModalOpen: selectTxModalOpen(state),
    receiveModalOpen: selectReceiveModalOpen(state),
    loadingTxs: selectTransactionsLoading(state),
    activeNode: selectActiveNodeApi(state),
  }));

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
      onRequestTestnetStx={async () => new Api(activeNode.url).getFaucetStx(address)}
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
