import React, { FC, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@blockstack/ui';
import { useHotkeys } from 'react-hotkeys-hook';

import { Api } from '@api/api';
import { increment, decrement } from '@utils/mutate-numbers';
import { RootState } from '@store/index';
import { openInExplorer } from '@utils/external-links';
import { selectAddress } from '@store/keys';
import { selectActiveNodeApi } from '@store/stacks-node';
import { selectAddressBalance, selectAvailableBalance } from '@store/address';
import {
  selectTransactionList,
  selectTransactionsLoading,
  selectTransactionListFetchError,
} from '@store/transaction';
import { selectPendingTransactions } from '@store/pending-transaction';
import {
  selectLoadingStacking,
  selectNextCycleInfo,
  selectPoxInfo,
  selectStackerInfo,
} from '@store/stacking';
import {
  homeActions,
  selectTxModalOpen,
  selectReceiveModalOpen,
  selectHomeCardState,
  HomeCardState,
} from '@store/home';
import {
  TransactionList,
  StackingPromoCard,
  StackingParticipationCard,
  StackingRewardCard,
  TransactionListItem,
  BalanceCard,
} from '@components/home';
import { TransactionModal } from '@modals/transaction/transaction-modal';
import { ReceiveStxModal } from '@modals/receive-stx/receive-stx-modal';
import { TransactionListItemPending } from '@components/home/transaction-list/transaction-list-item-pending';

import { StackingCard } from '@components/home/stacking-card';
import { StackingLoading } from '@components/home/stacking-loading';
import { StackingBeginsSoonCard } from '@components/home/stacking-begins-soon-card';

import { HomeLayout } from './home-layout';

export const Home: FC = () => {
  const dispatch = useDispatch();

  const {
    address,
    balance,
    spendableBalance,
    txs,
    pendingTxs,
    loadingTxs,
    txModalOpen,
    txListFetchError,
    receiveModalOpen,
    activeNode,
    stackingDetails,
    nextCycleInfo,
    stackerInfo,
    stackingCardState,
  } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    txs: selectTransactionList(state),
    spendableBalance: selectAvailableBalance(state),
    pendingTxs: selectPendingTransactions(state),
    balance: selectAddressBalance(state),
    txModalOpen: selectTxModalOpen(state),
    receiveModalOpen: selectReceiveModalOpen(state),
    loadingTxs: selectTransactionsLoading(state),
    txListFetchError: selectTransactionListFetchError(state),
    activeNode: selectActiveNodeApi(state),
    nextCycleInfo: selectNextCycleInfo(state),
    stackingDetails: selectPoxInfo(state),
    stackerInfo: selectStackerInfo(state),
    stackingLoading: selectLoadingStacking(state),
    stackingCardState: selectHomeCardState(state),
  }));

  const focusedTxIdRef = useRef<string | null>(null);
  const txDomNodeRefMap = useRef<Record<string, HTMLButtonElement>>({});

  const focusTxDomNode = useCallback(
    (shift: (i: number) => number) => {
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
    },
    [pendingTxs, txs]
  );

  useHotkeys('j', () => focusTxDomNode(increment), [txs, pendingTxs]);
  useHotkeys('k', () => focusTxDomNode(decrement), [txs, pendingTxs]);

  if (!address) return <Spinner />;

  const txCount = txs.length + pendingTxs.length;

  const transactionList = (
    <>
      <TransactionList
        txCount={txCount}
        loading={loadingTxs}
        node={activeNode}
        error={txListFetchError}
      >
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
      lockedStx={stackerInfo?.amount_microstx}
      balance={balance}
      onSelectSend={() => dispatch(homeActions.openTxModal())}
      onSelectReceive={() => dispatch(homeActions.openReceiveModal())}
      onRequestTestnetStx={async ({ stacking }) =>
        new Api(activeNode.url).getFaucetStx(address, stacking)
      }
    />
  );

  const stackingCardMap: Record<HomeCardState, JSX.Element> = {
    [HomeCardState.LoadingResources]: <StackingLoading />,
    [HomeCardState.NotEnoughStx]: (
      <StackingPromoCard
        minRequiredMicroStx={stackingDetails?.paddedMinimumStackingAmountMicroStx || 0}
      />
    ),
    [HomeCardState.EligibleToParticipate]: <StackingParticipationCard />,
    [HomeCardState.StackingPendingContactCall]: <StackingLoading />,
    [HomeCardState.StackingPreCycle]: (
      <StackingBeginsSoonCard blocksTillNextCycle={nextCycleInfo?.blocksToNextCycle} />
    ),
    [HomeCardState.StackingActive]: <StackingCard />,
    [HomeCardState.PostStacking]: <></>,
  };

  const stackingRewardCard = (
    <StackingRewardCard lifetime="0.0281 Bitcoin (sample)" lastCycle="0.000383 Bitcoin (sample)" />
  );

  return (
    <>
      {receiveModalOpen && <ReceiveStxModal address={address} />}
      {txModalOpen && <TransactionModal balance={spendableBalance || '0'} address={address} />}
      <HomeLayout
        transactionList={transactionList}
        balanceCard={balanceCard}
        stackingCard={stackingCardMap[stackingCardState]}
        stackingRewardCard={stackingRewardCard}
      />
    </>
  );
};
