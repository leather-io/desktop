import React, { useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@blockstack/ui';

import { RootState } from '../../store';
import { getAddressTransactions } from '../../store/transaction/transaction.actions';
import { openInExplorer } from '../../utils/external-links';
import { selectAddress } from '../../store/keys/keys.reducer';
import { getAddressDetails } from '../../store/address/address.actions';
import { selectAddressBalance } from '../../store/address/address.reducer';
import { selectTransactions } from '../../store/transaction/transaction.reducer';
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

export const Home: FC = () => {
  const dispatch = useDispatch();
  const { address, balance, txs, pendingTxs, txModalOpen, receiveModalOpen } = useSelector(
    (state: RootState) => ({
      address: selectAddress(state),
      txs: selectTransactions(state),
      balance: selectAddressBalance(state),
      pendingTxs: selectPendingTransactions(state),
      txModalOpen: selectTxModalOpen(state),
      receiveModalOpen: selectReceiveModalOpen(state),
    })
  );

  const checkIfPendingTxIsComplete = async (address: string) => {
    const [error, txResponse] = await safeAwait(Api.getTxDetails(address));
    if (error || !txResponse || txResponse.data.tx_status === 'pending') {
      return;
    }
    if (txResponse.data.tx_status === 'success') {
      dispatch(pendingTransactionSuccessful(txResponse.data));
    }
  };

  useInterval(() => {
    if (!address) return;
    pendingTxs.forEach(tx => void checkIfPendingTxIsComplete(safelyFormatHexTxid(tx.txId)));
    dispatch(getAddressTransactions(address));
    dispatch(getAddressDetails(address));
  }, 5_000);

  useEffect(() => {
    if (!address) return;
    dispatch(getAddressTransactions(address));
    dispatch(getAddressDetails(address));
  }, [dispatch, address]);

  if (!address) return <Spinner />;

  const transactionList = (
    <>
      <TransactionList txCount={txs.length + pendingTxs.length}>
        {pendingTxs.map(pTx => (
          <TransactionListItemPending key={pTx.txId} tx={pTx} onSelectTx={openInExplorer} />
        ))}
        {txs.map(tx => (
          <TransactionListItem
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
