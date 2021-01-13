import React, { FC } from 'react';
import { Text } from '@blockstack/ui';

export const TransactionListTitle: FC = ({ children }) => (
  <Text display="block" textStyle="body.large.medium">
    {children}
  </Text>
);
