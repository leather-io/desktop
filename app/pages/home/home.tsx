import React, { useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@blockstack/ui';

import { RootState } from '../../store';
import {
  getAddressTransactions,
  openInExplorer,
} from '../../store/transaction/transaction.actions';
import { selectAddress } from '../../store/keys/keys.reducer';
import { getAddressDetails } from '../../store/address/address.actions';
import { selectAddressBalance } from '../../store/address/address.reducer';
import {
  selectTransactions,
  selectPendingTransactions,
} from '../../store/transaction/transaction.reducer';
import { homeActions } from '../../store/home/home.reducer';
import {
  TransactionList,
  StackingPromoCard,
  StackingRewardCard,
  TransactionListItem,
  BalanceCard,
} from '../../components/home';
import { TransactionModal } from '../../modals/transaction/transaction-modal';
import { HomeLayout } from './home-layout';
import { TransactionListItemPending } from '../../components/home/transaction-list/transaction-list-item-pending';

export const Home: FC = () => {
  const dispatch = useDispatch();
  const { address, balance, transactions, pendingTransactions } = useSelector(
    (state: RootState) => ({
      address: selectAddress(state),
      transactions: selectTransactions(state),
      balance: selectAddressBalance(state),
      pendingTransactions: selectPendingTransactions(state),
    })
  );

  useInterval(() => {
    if (!address) return;
    dispatch(getAddressTransactions(address));
    dispatch(getAddressDetails(address));
  }, 10_000);

  useEffect(() => {
    if (!address) return;
    // STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6
    dispatch(getAddressTransactions(address));
    dispatch(getAddressDetails(address));
  }, [dispatch, address]);

  if (!address) return <Spinner />;

  const transactionList = (
    <TransactionList txCount={transactions.length}>
      {transactions.map(tx => (
        <TransactionListItem key={tx.tx_id} tx={tx} address={address} onSelectTx={openInExplorer} />
      ))}
    </TransactionList>
  );
  const balanceCard = (
    <BalanceCard
      balance={balance}
      onSelectSend={() => dispatch(homeActions.openModal())}
      onSelectReceive={() => ({})}
    />
  );
  const stackingPromoCard = <StackingPromoCard />;
  const stackingRewardCard = (
    <StackingRewardCard lifetime="0.0281 Bitcoin (sample)" lastCycle="0.000383 Bitcoin (sample)" />
  );

  return (
    <>
      <TransactionModal balance={balance || '0'} address={address} />
      <HomeLayout
        transactionList={transactionList}
        balanceCard={balanceCard}
        stackingPromoCard={stackingPromoCard}
        stackingRewardCard={stackingRewardCard}
      />
    </>
  );
};
