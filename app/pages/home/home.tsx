import { HomeLayout } from './home-layout';
import {
  TransactionList,
  StackingPromoCard,
  StackingRewardCard,
  TransactionListItem,
  BalanceCard,
} from '@components/home';
import { DelegationCard } from '@components/home/delegation-card';
import { StackingBeginsSoonCard } from '@components/home/stacking-begins-soon-card';
import { StackingCard } from '@components/home/stacking-card';
import { StackingError } from '@components/home/stacking-error-card';
import { StackingLoading } from '@components/home/stacking-loading';
import { TransactionListItemMempool } from '@components/home/transaction-list/transaction-list-item-mempool';
import routes from '@constants/routes.json';
import { useAnalytics } from '@hooks/use-analytics';
import { useApi } from '@hooks/use-api';
import { useBalance } from '@hooks/use-balance';
import { useDelegationStatus } from '@hooks/use-delegation-status';
import { usePromptUserToSetDiagnosticPermissions } from '@hooks/use-diagnostic-permission-prompt';
import { useLatestNonce } from '@hooks/use-latest-nonce';
import { useTransactionList } from '@hooks/use-transaction-list';
import { ReceiveStxModal } from '@modals/receive-stx/receive-stx-modal';
import { RequestDiagnosticsModal } from '@modals/request-diagnostics/request-diagnostic-modal';
import { RevokeDelegationModal } from '@modals/revoke-delegation/revoke-delegation-modal';
import { SendStxModal } from '@modals/send-stx/send-stx-modal';
import { Spinner } from '@stacks/ui';
import {
  homeActions,
  selectTxModalOpen,
  selectReceiveModalOpen,
  selectHomeCardState,
  HomeCardState,
} from '@store/home';
import { selectRevokeDelegationModalOpen } from '@store/home/home.reducer';
import { RootState } from '@store/index';
import { selectAddress } from '@store/keys';
import { selectLoadingStacking, selectNextCycleInfo, selectStackerInfo } from '@store/stacking';
import { selectActiveNodeApi } from '@store/stacks-node';
import { selectTransactionsLoading, selectTransactionListFetchError } from '@store/transaction';
import { openTxInExplorer } from '@utils/external-links';
import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

export const Home: FC = () => {
  const dispatch = useDispatch();
  const api = useApi();
  useLatestNonce();
  usePromptUserToSetDiagnosticPermissions();

  const { delegated: isDelegated } = useDelegationStatus();
  const { availableBalance } = useBalance();

  const {
    address,
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

  const { txs, pendingTxs, txCount, focusedTxIdRef, txDomNodeRefMap } = useTransactionList();

  const analytics = useAnalytics();

  if (!address) return <Spinner />;

  const openTxInExplorerTracked = (txId: string) => {
    void analytics.track('view_transaction');
    return openTxInExplorer(txId);
  };

  const transactionList = (
    <>
      <TransactionList
        txCount={txCount}
        loading={loadingTxs}
        node={activeNode}
        error={txListFetchError}
      >
        {pendingTxs.map(pendingTxs => (
          <TransactionListItemMempool
            address={address}
            domNodeMapRef={txDomNodeRefMap}
            activeTxIdRef={focusedTxIdRef}
            key={pendingTxs.tx_id}
            tx={pendingTxs}
            onSelectTx={openTxInExplorerTracked}
          />
        ))}
        {txs.map(tx => (
          <TransactionListItem
            domNodeMapRef={txDomNodeRefMap}
            activeTxIdRef={focusedTxIdRef}
            key={tx.tx.tx_id}
            txWithEvents={tx}
            onSelectTx={openTxInExplorerTracked}
          />
        ))}
      </TransactionList>
    </>
  );
  const balanceCard = (
    <BalanceCard
      address={address}
      onSelectSend={() => dispatch(homeActions.openTxModal())}
      onSelectReceive={() => dispatch(homeActions.openReceiveModal())}
      onRequestTestnetStx={async ({ stacking }) => api.getFaucetStx(address, stacking)}
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
      <ReceiveStxModal isOpen={receiveModalOpen} />
      <SendStxModal isOpen={txModalOpen} balance={availableBalance.toString()} address={address} />
      {revokeDelegationModalOpen && <RevokeDelegationModal />}
      <HomeLayout
        transactionList={transactionList}
        balanceCard={balanceCard}
        stackingCard={isDelegated ? <DelegationCard /> : stackingCardMap[stackingCardState]}
        stackingRewardCard={stackingRewardCard}
      />
      <Switch>
        <Route exact path={routes.HOME_REQUEST_DIAGNOSTICS} component={RequestDiagnosticsModal} />
      </Switch>
    </>
  );
};
