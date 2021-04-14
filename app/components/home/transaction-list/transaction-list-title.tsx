import React, { FC } from 'react';
import { Text } from '@stacks/ui';

export const TransactionListTitle: FC = ({ children }) => (
  <Text display="block" textStyle="body.large.medium">
    {children}
  </Text>
);
