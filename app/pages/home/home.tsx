import React, { FC, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Flex, Spinner, Text } from '@blockstack/ui';
import { useHotkeys } from 'react-hotkeys-hook';
import BigNumber from 'bignumber.js';

import { Api } from '@api/api';
import { microStxToStx } from '@utils/unit-convert';
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
import { selectNextCycleInfo, selectPoxInfo, selectStackerInfo } from '@store/stacking';
import { homeActions, selectTxModalOpen, selectReceiveModalOpen } from '@store/home';
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

import { HomeLayout } from './home-layout';
import { WaffleChart } from '@components/chart/waffle-chart';
import { StackingBeginsSoonCard } from '@components/home/stacking-begins-soon-card';

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

  const meetsMinStackingThreshold =
    balance !== null &&
    stackingDetails !== null &&
    new BigNumber(balance).isGreaterThan(stackingDetails.min_amount_ustx);

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
      lockedStx={stackerInfo?.amountMicroStx}
      balance={balance}
      onSelectSend={() => dispatch(homeActions.openTxModal())}
      onSelectReceive={() => dispatch(homeActions.openReceiveModal())}
      onRequestTestnetStx={async ({ stacking }) =>
        new Api(activeNode.url).getFaucetStx(address, stacking)
      }
    />
  );

  const card = (
    <>
      {stackingDetails && stackerInfo && (
        <Flex
          flexDirection="column"
          mt="extra-loose"
          borderRadius="8px"
          boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
          border="1px solid #F0F0F5"
          px="loose"
          minHeight="180px"
        >
          {stackerInfo &&
            !stackerInfo?.hasAddressStackingCycleStarted &&
            !stackerInfo.hasStackingPeriodFinished && (
              <StackingBeginsSoonCard blocksTillNextCycle={nextCycleInfo?.blocksToNextCycle} />
            )}
          {stackerInfo?.isCurrentlyStacking && (
            <Box>
              <Text
                display="block"
                textStyle="body.large.medium"
                mt="base-loose"
                textAlign="center"
              >
                Stacking progress
              </Text>
              <Flex justifyContent="space-between" mt="base">
                <Text textStyle="body.small.medium">Current stacking cycle</Text>
              </Flex>
              <Flex
                maxWidth={[null, null, '325px']}
                flexWrap="wrap"
                alignContent="flex-start"
                mt="tight"
              >
                <WaffleChart
                  points={[
                    ...Array.from({
                      length:
                        (stackingDetails?.reward_cycle_length || 0) -
                        (nextCycleInfo?.blocksToNextCycle || 0),
                    }).map(() => true),
                    ...Array.from({ length: nextCycleInfo?.blocksToNextCycle || 0 }).map(
                      () => false
                    ),
                  ]}
                />
              </Flex>
              <Box mr="2px">
                <Flex justifyContent="space-between" mt="base">
                  <Text textStyle="body.small.medium">Blocks until next cycle</Text>
                  <Text textStyle="body.small">{nextCycleInfo?.blocksToNextCycle}</Text>
                </Flex>
                <Flex justifyContent="space-between" mt="tight">
                  <Text textStyle="body.small.medium">You're stacking for</Text>
                  <Text textStyle="body.small">
                    {stackerInfo?.lockPeriod} cycle{stackerInfo.lockPeriod > 1 ? 's' : ''}
                  </Text>
                </Flex>
                {stackerInfo.lockPeriod > 1 && (
                  <Flex justifyContent="space-between" mt="tight">
                    <Text textStyle="body.small.medium">Current cycle</Text>
                    <Text textStyle="body.small">
                      {stackerInfo.currentCycleOfTotal} of {stackerInfo?.lockPeriod}
                    </Text>
                  </Flex>
                )}
                <Flex flexDirection="column" mt="tight" mb="base-loose">
                  <Text textStyle="body.small.medium">Reward to be paid to</Text>
                  <Text as="code" fontSize="13px" mt="tight" color="ink.600">
                    {stackerInfo?.btcAddress}
                  </Text>
                </Flex>
              </Box>
            </Box>
          )}
        </Flex>
      )}
      {(stackerInfo === null ||
        ((stackerInfo ? !stackerInfo.isPreStackingPeriodStart : true) &&
          (stackerInfo ? !stackerInfo.isCurrentlyStacking : true))) && (
        <>
          {meetsMinStackingThreshold ? (
            <StackingParticipationCard />
          ) : (
            <StackingPromoCard
              minRequiredStx={microStxToStx(stackingDetails?.min_amount_ustx || 0).toNumber()}
            />
          )}
        </>
      )}
    </>
  );

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
        stackingCard={card}
        stackingRewardCard={stackingRewardCard}
      />
    </>
  );
};
