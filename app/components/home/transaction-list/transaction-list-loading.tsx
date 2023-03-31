import { templateTxBoxProps } from './transaction-list-item-pseudo';
import { Flex, Spinner, color } from '@stacks/ui';
import React from 'react';

export const TransactionListLoading = () => (
  <Flex {...templateTxBoxProps}>
    <Spinner size="sm" color={color('text-caption')} />
  </Flex>
);
