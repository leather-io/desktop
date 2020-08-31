import React, { FC } from 'react';

import { TransactionListTitle } from './transaction-list-title';
import { TransactionListEmpty } from './transaction-list-empty';
import { TransactionListLoading } from './transaction-list-loading';

interface TransactionListProps {
  txCount: number;
  loading: boolean;
}

export const TransactionList: FC<TransactionListProps> = ({ txCount, loading, children }) => {
  if (loading) return <TransactionListLoading />;
  if (txCount === 0) return <TransactionListEmpty />;
  return (
    <>
      <TransactionListTitle>Activity</TransactionListTitle>
      {children}
    </>
  );
};
