import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { deriveRootKeychainFromMnemonic } from '@blockstack/keychain';

import { selectMnemonic } from '../../store/keys';
import { BIP32Interface } from '../../types';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { StackingPromoCard } from '../../components/stacking-promo-card';
import { StackingRewardCard } from '../../components/stacking-rewards-card';
import { BalanceCard } from '../../components/balance-card';
import { HomeLayout } from './home-layout';

//
// Placeholder component
export const Home: React.FC = () => {
  const mnemonic = useSelector(selectMnemonic);
  const [keychain, setKeychain] = useState<{ rootNode: BIP32Interface } | null>(null);

  useEffect(() => {
    const deriveMasterKeychain = async () => {
      if (!mnemonic) return;
      const { rootNode } = await deriveRootKeychainFromMnemonic(mnemonic, '');
      setKeychain({ rootNode });
    };
    void deriveMasterKeychain();
  }, [mnemonic]);

  if (keychain === null) return <></>;

  return (
    <HomeLayout
      balanceCard={<BalanceCard balance="124,000.1003 STX" />}
      transactionList={<TransactionList txs={[]} />}
      stackingPromoCard={<StackingPromoCard />}
      stackingRewardCard={
        <StackingRewardCard lifetime="0.0281 Bitcoin" lastCycle="0.000383 Bitcoin" />
      }
    />
  );
};
