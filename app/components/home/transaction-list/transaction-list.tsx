import React, { FC } from 'react';
import { Flex } from '@stacks/ui';
import { StacksNode } from '@store/stacks-node';
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
  if (error && txCount === 0) return <TransactionListError node={node} error={error} />;
  if (txCount === 0) return <TransactionListEmpty />;

  return (
    <>
      <Flex mb="loose" justifyContent="space-between" alignItems="flex-end">
        <TransactionListTitle>Activity</TransactionListTitle>
        {/* TODO: show all pending tx number here and link to explorer */}
      </Flex>
      {children}
    </>
  );
};
