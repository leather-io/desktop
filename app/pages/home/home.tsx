import React, { useEffect, useState, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { shell } from 'electron';
import { deriveRootKeychainFromMnemonic } from '@blockstack/keychain';

import { selectMnemonic } from '../../store/keys';
import { BIP32Interface } from '../../types/bip32';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { StackingPromoCard } from '../../components/stacking-promo-card';
import { StackingRewardCard } from '../../components/stacking-rewards-card';
import { BalanceCard } from '../../components/balance-card';

import { HomeLayout } from './home-layout';
import { selectAddress } from '../../store/keys/keys.reducer';
import { selectTransactions } from '../../store/transaction/transaction.reducer';
import { RootState } from '../../store/index';
import { getTransactions } from '../../store/transaction/transaction.actions';
import { TransactionListItem } from '../../components/transaction-list/transaction-list-item';

export const Home: FC = () => {
  const dispatch = useDispatch();
  const { mnemonic, address, transactions } = useSelector((state: RootState) => ({
    mnemonic: selectMnemonic(state),
    address: selectAddress(state),
    transactions: selectTransactions(state),
  }));
  const [keychain, setKeychain] = useState<{ rootNode: BIP32Interface } | null>(null);

  useEffect(() => {
    const deriveMasterKeychain = async () => {
      if (!mnemonic) return;
      const { rootNode } = await deriveRootKeychainFromMnemonic(mnemonic, '');
      setKeychain({ rootNode });
    };
    void deriveMasterKeychain();
  }, [mnemonic]);

  useEffect(() => {
    if (!address) return;
    // Demo address
    // ST2K2GK11JDC2DT8M9B5T28P2FHMXMECKDGDNCQCN
    dispatch(getTransactions(address));
  }, [dispatch, address]);

  if (keychain === null || address === undefined) return <>loading</>;

  const openInExplorer = (txId: string) =>
    shell.openExternal(`https://testnet-explorer.blockstack.org/txid/${txId}`);

  const transactionList = (
    <TransactionList txCount={transactions.length}>
      {transactions.map(tx => (
        <TransactionListItem key={tx.tx_id} tx={tx} address={address} onSelectTx={openInExplorer} />
      ))}
    </TransactionList>
  );
  const balanceCard = <BalanceCard balance="124,000.1003 STX" />;
  const stackingPromoCard = <StackingPromoCard />;
  const stackingRewardCard = (
    <StackingRewardCard lifetime="0.0281 Bitcoin" lastCycle="0.000383 Bitcoin" />
  );

  const homeLayoutComponents = {
    transactionList,
    balanceCard,
    stackingPromoCard,
    stackingRewardCard,
  };

  return <HomeLayout {...homeLayoutComponents} />;
};
