import React from 'react';
import { Text, Flex } from '@blockstack/ui';

import { useNavigatorOnline } from '@hooks/use-navigator-online';
import { templateTxBoxProps } from './transaction-list-item-pseudo';

export const TransactionListEmpty = () => {
  const { isOnline } = useNavigatorOnline();
  return (
    <Flex {...templateTxBoxProps}>
      <Text textStyle="body.small" display="block" textAlign="center" mb="tight">
        {isOnline
          ? `You haven't made any transactions yet`
          : `Cannot fetch transactions. Ensure you're connected to the internet`}
      </Text>
    </Flex>
  );
};
