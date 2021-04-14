import React, { FC, useState } from 'react';
import { Box, Button, Text, ArrowIcon, EncryptionIcon, Flex } from '@stacks/ui';

import { features, NETWORK } from '@constants/index';
import { toHumanReadableStx } from '@utils/unit-convert';
import { safeAwait } from '@utils/safe-await';
import { delay } from '@utils/delay';

import { ExternalLink } from '@components/external-link';
import { makeExplorerAddressLink } from '@utils/external-links';
import { isTestnet } from '@utils/network-utils';
import { useBalance } from '@hooks/use-balance';

interface BalanceCardProps {
  address: string | null;
  onSelectSend(): void;

  onSelectReceive(): void;

  onRequestTestnetStx({ stacking }: { stacking: boolean }): Promise<any>;
}

export const BalanceCard: FC<BalanceCardProps> = props => {
  const { address, onSelectReceive, onSelectSend, onRequestTestnetStx } = props;

  const [requestingTestnetStx, setRequestingTestnetStx] = useState(false);
  const { totalBalance, availableBalance, lockedBalance } = useBalance();

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

  return (
    <Box>
      <Flex>
        <Text textStyle="body.large.medium" display="block">
          Total balance
        </Text>

        {address !== null && (
          <ExternalLink
            href={makeExplorerAddressLink(address)}
            textStyle="caption"
            ml="tight"
            color="blue"
          >
            View on Explorer
          </ExternalLink>
        )}
      </Flex>
      <Text fontSize="40px" lineHeight="56px" fontWeight="bold" letterSpacing="-0.01em">
        {totalBalance === null ? '–' : toHumanReadableStx(totalBalance.toString())}
      </Text>

      {features.stacking && lockedBalance !== null && lockedBalance.isGreaterThan(0) && (
        <Flex alignItems="center" mt="tight" color="ink.600" fontSize={['14px', '16px']}>
          <EncryptionIcon size="16px" color="#409EF3" display={['none', 'block']} mr="tight" />
          <Text>{toHumanReadableStx(lockedBalance.toString())} locked</Text>
          <Text children="·" mx="base-tight" />
          <Text>{toHumanReadableStx(availableBalance.toString())} available</Text>
        </Flex>
      )}
      <Box mt="loose">
        <Button size="md" onClick={onSelectSend} isDisabled={availableBalance.isEqualTo(0)}>
          <ArrowIcon direction="up" mr="base-tight" />
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
