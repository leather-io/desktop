import React from 'react';
import { Flex, Spinner } from '@blockstack/ui';

import { templateTxBoxProps } from './transaction-list-item-pseudo';

export const TransactionListLoading = () => (
  <Flex {...templateTxBoxProps}>
    <Spinner size="sm" color="ink.300" />
  </Flex>
);
