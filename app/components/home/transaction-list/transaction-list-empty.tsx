import { templateTxBoxProps } from './transaction-list-item-pseudo';
import { EmptyTxList } from '@components/icons/empty-tx-list';
import { useNavigatorOnline } from '@hooks/use-navigator-online';
import { Text, Flex, Box, color } from '@stacks/ui';
import React from 'react';

export const TransactionListEmpty = () => {
  const { isOnline } = useNavigatorOnline();
  return (
    <Flex {...templateTxBoxProps}>
      <Box maxWidth="180px" mb="loose">
        <EmptyTxList />
      </Box>
      <Text
        color={color('text-caption')}
        textStyle="body.small"
        display="block"
        textAlign="center"
        mb="tight"
      >
        {isOnline
          ? `You haven't made any transactions yet`
          : `Cannot fetch transactions. Ensure you're connected to the internet`}
      </Text>
    </Flex>
  );
};
