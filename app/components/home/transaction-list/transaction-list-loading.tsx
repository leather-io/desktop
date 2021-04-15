import React from 'react';
import { Flex, Spinner, color } from '@stacks/ui';

import { templateTxBoxProps } from './transaction-list-item-pseudo';

export const TransactionListLoading = () => (
  <Flex {...templateTxBoxProps}>
    <Spinner size="sm" color={color('text-caption')} />
  </Flex>
);
