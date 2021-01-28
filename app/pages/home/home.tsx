import React, { FC, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@blockstack/ui';
import { useHotkeys } from 'react-hotkeys-hook';

import { Api } from '@api/api';
import { increment, decrement } from '@utils/mutate-numbers';
import { RootState } from '@store/index';
import { openTxInExplorer } from '@utils/external-links';
import { selectAddress } from '@store/keys';
import { selectActiveNodeApi } from '@store/stacks-node';
import { selectAddressBalance, selectAvailableBalance } from '@store/address';
import {
  selectTransactionList,
  selectTransactionsLoading,
  selectTransactionListFetchError,
} from '@store/transaction';
import { selectPendingTransactions } from '@store/pending-transaction';
import { selectLoadingStacking, selectNextCycleInfo, selectStackerInfo } from '@store/stacking';
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
  StackingRewardCard,
  TransactionListItem,
  BalanceCard,
} from '@components/home';
import { TransactionModal } from '@modals/transaction/transaction-modal';
import { ReceiveStxModal } from '@modals/receive-stx/receive-stx-modal';

import { StackingCard } from '@components/home/stacking-card';
import { StackingLoading } from '@components/home/stacking-loading';
import { StackingBeginsSoonCard } from '@components/home/stacking-begins-soon-card';
import { StackingError } from '@components/home/stacking-error-card';

import { HomeLayout } from './home-layout';
import { TransactionListItemMempool } from '@components/home/transaction-list/transaction-list-item-mempool';
import { useMempool } from '@hooks/use-mempool';
import { DelegationCard } from '@components/home/delegation-card';
import { useDelegationStatus } from '@hooks/use-delegation-status';
import { RevokeDelegationModal } from '@modals/revoke-delegation/revoke-delegation-modal';
import { selectRevokeDelegationModalOpen } from '../../store/home/home.reducer';

export const Home: FC = () => {
  const dispatch = useDispatch();

  const { delegated: isDelegated } = useDelegationStatus();

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
    revokeDelegationModalOpen,
    activeNode,
    stackerInfo,
    stackingCardState,
  } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    txs: selectTransactionList(state),
    spendableBalance: selectAvailableBalance(state),
    pendingTxs: selectPendingTransactions(state),
    balance: selectAddressBalance(state),
    txModalOpen: selectTxModalOpen(state),
    revokeDelegationModalOpen: selectRevokeDelegationModalOpen(state),
    receiveModalOpen: selectReceiveModalOpen(state),
    loadingTxs: selectTransactionsLoading(state),
    txListFetchError: selectTransactionListFetchError(state),
    activeNode: selectActiveNodeApi(state),
    nextCycleInfo: selectNextCycleInfo(state),
    stackerInfo: selectStackerInfo(state),
    stackingLoading: selectLoadingStacking(state),
    stackingCardState: selectHomeCardState(state),
  }));

  const { mempoolTxs } = useMempool();

  const focusedTxIdRef = useRef<string | null>(null);
  const txDomNodeRefMap = useRef<Record<string, HTMLButtonElement>>({});

  const focusTxDomNode = useCallback(
    (shift: (i: number) => number) => {
      const allTxs = [...mempoolTxs, ...pendingTxs, ...txs];
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
    [txs, pendingTxs, mempoolTxs]
  );

  useHotkeys('j', () => focusTxDomNode(increment), [txs, pendingTxs, mempoolTxs]);
  useHotkeys('k', () => focusTxDomNode(decrement), [txs, pendingTxs, mempoolTxs]);

  if (!address) return <Spinner />;

  const txCount = txs.length + pendingTxs.length + mempoolTxs.length;

  const transactionList = (
    <>
      <TransactionList
        txCount={txCount}
        loading={loadingTxs}
        node={activeNode}
        error={txListFetchError}
      >
        {mempoolTxs
          .filter(mempoolTx => !txs.map(tx => tx.tx_id).includes(mempoolTx.tx_id))
          .map(mempoolTx => (
            <TransactionListItemMempool
              address={address}
              domNodeMapRef={txDomNodeRefMap}
              activeTxIdRef={focusedTxIdRef}
              key={mempoolTx.tx_id}
              tx={mempoolTx}
              onSelectTx={openTxInExplorer}
            />
          ))}
        {pendingTxs
          // .filter(pendingTx => !txs.map(tx => tx.tx_id).includes(pendingTx.tx_id))
          .map(pendingTx => (
            <TransactionListItemMempool
              address={address}
              domNodeMapRef={txDomNodeRefMap}
              activeTxIdRef={focusedTxIdRef}
              key={pendingTx.tx_id}
              tx={pendingTx}
              onSelectTx={openTxInExplorer}
            />
          ))}
        {txs.map(tx => (
          <TransactionListItem
            domNodeMapRef={txDomNodeRefMap}
            activeTxIdRef={focusedTxIdRef}
            key={tx.tx_id}
            tx={tx}
            address={address}
            onSelectTx={openTxInExplorer}
          />
        ))}
      </TransactionList>
    </>
  );
  const balanceCard = (
    <BalanceCard
      address={address}
      lockedStx={balance?.locked}
      balance={balance?.balance || null}
      onSelectSend={() => dispatch(homeActions.openTxModal())}
      onSelectReceive={() => dispatch(homeActions.openReceiveModal())}
      onRequestTestnetStx={async ({ stacking }) =>
        new Api(activeNode.url).getFaucetStx(address, stacking)
      }
    />
  );

  const stackingCardMap: Record<HomeCardState, JSX.Element> = {
    [HomeCardState.LoadingResources]: <StackingLoading />,
    [HomeCardState.NotEnoughStx]: <StackingPromoCard />,
    [HomeCardState.EligibleToParticipate]: <StackingPromoCard />,
    [HomeCardState.StackingPendingContactCall]: <StackingLoading />,
    [HomeCardState.StackingPreCycle]: (
      <StackingBeginsSoonCard blocksTillNextCycle={stackerInfo?.blocksUntilStackingCycleBegins} />
    ),
    [HomeCardState.StackingActive]: <StackingCard />,
    [HomeCardState.StackingError]: <StackingError />,
    [HomeCardState.PostStacking]: <></>,
  };

  const stackingRewardCard = (
    <StackingRewardCard lifetime="0.0281 Bitcoin (sample)" lastCycle="0.000383 Bitcoin (sample)" />
  );

  return (
    <>
      {receiveModalOpen && <ReceiveStxModal />}
      {txModalOpen && <TransactionModal balance={spendableBalance || '0'} address={address} />}
      {revokeDelegationModalOpen && <RevokeDelegationModal />}
      <HomeLayout
        transactionList={transactionList}
        balanceCard={balanceCard}
        stackingCard={isDelegated ? <DelegationCard /> : stackingCardMap[stackingCardState]}
        stackingRewardCard={stackingRewardCard}
      />
    </>
  );
};
