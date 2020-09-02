import React, { FC } from 'react';

import { StacksNode } from '../../../store/stacks-node/stacks-node.reducer';
import { TransactionListTitle } from './transaction-list-title';
import { TransactionListEmpty } from './transaction-list-empty';
import { TransactionListLoading } from './transaction-list-loading';
import { TransactionListError } from './transaction-list-error';

interface TransactionListProps {
  txCount: number;
  loading: boolean;
  node: StacksNode;
  error: string | null;
}

export const TransactionList: FC<TransactionListProps> = props => {
  const { node, txCount, loading, children, error } = props;

  if (loading) return <TransactionListLoading />;
  if (error) return <TransactionListError node={node} error={error} />;
  if (txCount === 0) return <TransactionListEmpty />;

  return (
    <>
      <TransactionListTitle>Activity</TransactionListTitle>
      {children}
    </>
  );
};
