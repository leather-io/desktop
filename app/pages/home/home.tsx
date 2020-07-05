import React, { useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { shell } from 'electron';

import { TransactionList } from '../../components/transaction-list/transaction-list';
import { StackingPromoCard } from '../../components/stacking-promo-card';
import { StackingRewardCard } from '../../components/stacking-rewards-card';
import { BalanceCard } from '../../components/balance-card';

import { selectAddress } from '../../store/keys/keys.reducer';
import { selectTransactions } from '../../store/transaction/transaction.reducer';
import { RootState } from '../../store/index';
import { getAddressTransactions } from '../../store/transaction/transaction.actions';
import { TransactionListItem } from '../../components/transaction-list/transaction-list-item';
import { getAddressDetails } from '../../store/address/address.actions';
import { HomeLayout } from './home-layout';
import { selectAddressBalance } from '../../store/address/address.reducer';
import { Spinner } from '@blockstack/ui';

export const Home: FC = () => {
  const dispatch = useDispatch();
  const { address, balance, transactions } = useSelector((state: RootState) => ({
    address: selectAddress(state),
    transactions: selectTransactions(state),
    balance: selectAddressBalance(state),
  }));

  // ST2K2GK11JDC2DT8M9B5T28P2FHMXMECKDGDNCQCN
  useEffect(() => {
    if (!address) return;
    dispatch(getAddressTransactions('ST2K2GK11JDC2DT8M9B5T28P2FHMXMECKDGDNCQCN'));
    dispatch(getAddressDetails('ST2K2GK11JDC2DT8M9B5T28P2FHMXMECKDGDNCQCN'));
  }, [dispatch, address]);

  if (!address) return <Spinner />;

  const openInExplorer = (txId: string) =>
    shell.openExternal(`https://testnet-explorer.blockstack.org/txid/${txId}`);

  const transactionList = (
    <TransactionList txCount={transactions.length}>
      {transactions.map(tx => (
        <TransactionListItem key={tx.tx_id} tx={tx} address={address} onSelectTx={openInExplorer} />
      ))}
    </TransactionList>
  );
  const balanceCard = <BalanceCard balance={balance === null ? '–' : balance} />;
  const stackingPromoCard = <StackingPromoCard />;
  const stackingRewardCard = (
    <StackingRewardCard lifetime="0.0281 Bitcoin (sample)" lastCycle="0.000383 Bitcoin (sample)" />
  );

  return (
    <HomeLayout
      transactionList={transactionList}
      balanceCard={balanceCard}
      stackingPromoCard={stackingPromoCard}
      stackingRewardCard={stackingRewardCard}
    />
  );
};
