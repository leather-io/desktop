import React, { FC } from 'react';
import { Text } from '@blockstack/ui';

export const TransactionListTitle: FC = ({ children }) => {
  return (
    <Text display="block" textStyle="body.large.medium" mb="loose">
      {children}
    </Text>
  );
};
