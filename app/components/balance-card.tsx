import React, { FC } from 'react';
import { Box, Button, Text } from '@blockstack/ui';

interface BalanceCardProps {
  balance: string;
}

export const BalanceCard: FC<BalanceCardProps> = ({ balance }) => {
  return (
    <Box>
      <Text textStyle="body.large.medium" display="block">
        Total balance
      </Text>
      <Text fontSize="40px" lineHeight="56px" fontWeight="bold" letterSpacing="-0.01em">
        {balance}
      </Text>
      <Box mt="loose">
        <Button size="md">Send</Button>
        <Button size="md" ml="tight">
          Receive
        </Button>
      </Box>
    </Box>
  );
};
