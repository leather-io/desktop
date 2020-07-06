import React, { FC } from 'react';

import { TransactionListTitle } from './transaction-list-title';
import { TransactionListEmpty } from './transaction-list-empty';

interface TransactionListProps {
  txCount: number;
}

export const TransactionList: FC<TransactionListProps> = ({ txCount, children }) => {
  if (txCount === 0) return <TransactionListEmpty />;
  return (
    <>
      <TransactionListTitle>Activity</TransactionListTitle>
      {children}
    </>
  );
};
