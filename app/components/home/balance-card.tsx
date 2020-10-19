import React, { FC, useState } from 'react';
import { Box, Button, Text, ArrowIcon, EncryptionIcon, Flex } from '@blockstack/ui';

import { features } from '@constants/index';
import { toHumanReadableStx } from '@utils/unit-convert';
import { safeAwait } from '@utils/safe-await';
import { delay } from '@utils/delay';
import BN from 'bn.js';

interface BalanceCardProps {
  balance: string | null;
  lockedSTX?: string;
  onSelectSend(): void;
  onSelectReceive(): void;
  onSelectStacking(): void;
  onRequestTestnetStx(): Promise<void>;
}

export const BalanceCard: FC<BalanceCardProps> = props => {
  const {
    balance,
    onSelectReceive,
    onSelectSend,
    onRequestTestnetStx,
    onSelectStacking,
    lockedSTX,
  } = props;

  const [requestingTestnetStx, setRequestingTestnetStx] = useState(false);
  const requestTestnetStacks = async () => {
    setRequestingTestnetStx(true);
    await safeAwait(Promise.allSettled([onRequestTestnetStx(), delay(1500)]));
    setRequestingTestnetStx(false);
  };

  const balanceBN = new BN(balance || 0, 10);
  const lockedBN = new BN(lockedSTX || 0, 10);
  const available = balanceBN.sub(lockedBN);
  return (
    <Box>
      <Text textStyle="body.large.medium" display="block">
        Total balance
      </Text>
      <Text fontSize="40px" lineHeight="56px" fontWeight="bold" letterSpacing="-0.01em">
        {balance === null ? '–' : toHumanReadableStx(balance)}
      </Text>

      {features.stacking && lockedBN.toNumber() !== 0 && (
        <Flex alignItems="center" mt="tight" color="ink.600" fontSize={['14px', '16px']}>
          <EncryptionIcon size="16px" color="#409EF3" display={['none', 'block']} mr="tight" />
          <Text onClick={onSelectStacking} cursor="pointer" borderBottom="1px dotted #677282">
            {toHumanReadableStx(lockedSTX || '0')} locked
          </Text>
          <Text children="·" mx="base-tight" />
          <Text>{toHumanReadableStx(available)} available</Text>
        </Flex>
      )}

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
          <Box
            mr="extra-tight"
            fontSize="18px"
            left="-4px"
            position="relative"
            display={['none', 'none', 'block']}
          >
            🚰
          </Box>
          {requestingTestnetStx ? 'Requesting faucet' : 'Get testnet STX'}
        </Button>
      </Box>
    </Box>
  );
};
