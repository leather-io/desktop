import React, { FC } from 'react';
import { TransactionListEmpty } from './transaction-list-empty';

interface TransactionListProps {
  txs: any[];
}

export const TransactionList: FC<TransactionListProps> = ({ txs }) => {
  if (txs.length === 0) return <TransactionListEmpty />;
  return null;
};
