import { Text } from '@stacks/ui';
import React, { FC } from 'react';

export const TransactionListTitle: FC = ({ children }) => (
  <Text display="block" textStyle="body.large.medium">
    {children}
  </Text>
);
