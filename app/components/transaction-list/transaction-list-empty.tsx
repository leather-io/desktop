import React from 'react';
import { Text, Flex } from '@blockstack/ui';

export const TransactionListEmpty = () => {
  return (
    <Flex
      borderRadius="8px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
      border="1px solid #F0F0F5"
      minHeight={['152px', '152px', '300px', '416px']}
      justifyContent="center"
      alignItems={['center', 'center', null, null]}
    >
      <Text textStyle="body.small" display="block" textAlign="center" mb="tight">
        You haven't made any transactions yet
      </Text>
    </Flex>
  );
};
