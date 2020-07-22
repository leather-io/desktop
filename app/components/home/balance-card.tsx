import React, { FC } from 'react';
import { Box, Button, Text, ArrowIcon } from '@blockstack/ui';
import { humanReadableStx } from '../../utils/format-stx';

interface BalanceCardProps {
  balance: string | null;
  onSelectSend: () => void;
  onSelectReceive: () => void;
}

export const BalanceCard: FC<BalanceCardProps> = ({ balance, onSelectReceive, onSelectSend }) => {
  return (
    <Box>
      <Text textStyle="body.large.medium" display="block">
        Total balance
      </Text>
      <Text fontSize="40px" lineHeight="56px" fontWeight="bold" letterSpacing="-0.01em">
        {balance === null ? '–' : humanReadableStx(balance)}
      </Text>
      <Box mt="loose">
        <Button size="md" onClick={onSelectSend} isDisabled={balance === '0' || balance === null}>
          <ArrowIcon direction="up" mr="base-tight" />
          Send
        </Button>
        <Button size="md" ml="tight" onClick={onSelectReceive}>
          <ArrowIcon direction="down" mr="base-tight" />
          Receive
        </Button>
      </Box>
    </Box>
  );
};
