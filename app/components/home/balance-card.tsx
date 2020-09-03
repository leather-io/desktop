import React, { FC, useState } from 'react';
import { Box, Button, Text, ArrowIcon } from '@blockstack/ui';

import { toHumanReadableStx } from '@utils/unit-convert';
import { safeAwait } from '@utils/safe-await';
import { delay } from '@utils/delay';

interface BalanceCardProps {
  balance: string | null;
  onSelectSend(): void;
  onSelectReceive(): void;
  onRequestTestnetStx(): Promise<any>;
}

export const BalanceCard: FC<BalanceCardProps> = args => {
  const { balance, onSelectReceive, onSelectSend, onRequestTestnetStx } = args;
  const [requestingTestnetStx, setRequestingTestnetStx] = useState(false);
  const requestTestnetStacks = async () => {
    setRequestingTestnetStx(true);
    await safeAwait(Promise.allSettled([onRequestTestnetStx(), delay(1500)]));
    setRequestingTestnetStx(false);
  };
  return (
    <Box>
      <Text textStyle="body.large.medium" display="block">
        Total balance
      </Text>
      <Text fontSize="40px" lineHeight="56px" fontWeight="bold" letterSpacing="-0.01em">
        {balance === null ? '–' : toHumanReadableStx(balance)}
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
        <Button mode="secondary" size="md" ml="tight" onClick={requestTestnetStacks}>
          <Box mr="extra-tight" fontSize="18px" left="-4px" position="relative">
            🚰
          </Box>
          {requestingTestnetStx ? 'Requesting faucet' : 'Get testnet STX'}
        </Button>
      </Box>
    </Box>
  );
};
