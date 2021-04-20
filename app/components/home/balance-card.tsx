import React, { FC, useState } from 'react';
import { Box, Button, Text, ArrowIcon, EncryptionIcon, Flex, color } from '@stacks/ui';

import { features, NETWORK } from '@constants/index';
import { toHumanReadableStx } from '@utils/unit-convert';
import { safeAwait } from '@utils/safe-await';
import { delay } from '@utils/delay';
import BN from 'bn.js';
import { ExternalLink } from '@components/external-link';
import { makeExplorerAddressLink } from '@utils/external-links';
import { isTestnet } from '@utils/network-utils';

interface BalanceCardProps {
  balance: string | null;
  address: string | null;
  lockedStx?: string;

  onSelectSend(): void;

  onSelectReceive(): void;

  onRequestTestnetStx({ stacking }: { stacking: boolean }): Promise<any>;
}

export const BalanceCard: FC<BalanceCardProps> = props => {
  const { balance, address, onSelectReceive, onSelectSend, onRequestTestnetStx, lockedStx } = props;

  const [requestingTestnetStx, setRequestingTestnetStx] = useState(false);

  const requestTestnetStacks = async (e: React.MouseEvent) => {
    if (NETWORK !== 'testnet') return;
    if (e.nativeEvent) setRequestingTestnetStx(true);
    const [error] = await safeAwait(
      Promise.all([onRequestTestnetStx({ stacking: e.nativeEvent.altKey }), delay(1500)])
    );
    if (error) {
      window.alert('Faucet request failed');
    }
    setRequestingTestnetStx(false);
  };

  const balanceBN = new BN(balance || 0, 10);
  const lockedBN = new BN(lockedStx || 0, 10);
  const available = balanceBN.sub(lockedBN);

  return (
    <Box>
      <Flex>
        <Text textStyle="body.large.medium" display="block">
          Total balance
        </Text>

        {address !== null && (
          <ExternalLink href={makeExplorerAddressLink(address)} textStyle="caption" ml="tight">
            View on Explorer
          </ExternalLink>
        )}
      </Flex>
      <Text fontSize="40px" lineHeight="56px" fontWeight="bold" letterSpacing="-0.01em">
        {balance === null ? '–' : toHumanReadableStx(balance)}
      </Text>

      {features.stacking && lockedBN.toNumber() !== 0 && (
        <Flex
          alignItems="center"
          mt="tight"
          color={color('text-caption')}
          fontSize={['14px', '16px']}
        >
          <EncryptionIcon
            size="16px"
            color={color('feedback-alert')}
            display={['none', 'block']}
            mr="tight"
          />
          <Text>{toHumanReadableStx(lockedStx || '0')} locked</Text>
          <Text children="·" mx="base-tight" />
          <Text>{toHumanReadableStx(available)} available</Text>
        </Flex>
      )}
      <Box mt="loose">
        <Button size="md" onClick={onSelectSend} isDisabled={balance === '0' || balance === null}>
          <ArrowIcon size="12px" {...({ direction: 'up' } as any)} mr="base-tight" />
          Send
        </Button>
        <Button size="md" ml="tight" onClick={onSelectReceive}>
          <ArrowIcon size="12px" {...({ direction: 'down' } as any)} mr="base-tight" />
          Receive
        </Button>
        {isTestnet() && (
          <Button
            mode="secondary"
            size="md"
            ml="tight"
            isDisabled={requestingTestnetStx}
            onClick={e => requestTestnetStacks(e)}
            title="Hold alt to request more STX. Use sparingly."
          >
            <Box
              mr="tight"
              fontSize="14px"
              left="-4px"
              position="relative"
              display={['none', 'none', 'block']}
            >
              🚰
            </Box>
            {requestingTestnetStx ? 'Requesting faucet' : 'Get testnet STX'}
          </Button>
        )}
      </Box>
    </Box>
  );
};
