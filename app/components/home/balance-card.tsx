import React, { FC, useState } from 'react';
import { Box, Button, Text, ArrowIcon, EncryptionIcon, Flex, color } from '@stacks/ui';

import { HomeSelectors } from 'app/tests/features/home.selectors';
import { features, NETWORK } from '@constants/index';
import { toHumanReadableStx } from '@utils/unit-convert';
import { safeAwait } from '@utils/safe-await';
import { delay } from '@utils/delay';

import { InternalLink } from '@components/internal-link';
import { makeExplorerAddressLink } from '@utils/external-links';
import { isTestnet } from '@utils/network-utils';
import { useBalance } from '@hooks/use-balance';
import { Title } from '@components/title';

interface BalanceCardProps {
  address: string | null;
  onSelectSend(): void;
  onSelectReceive(): void;
  onRequestTestnetStx({ stacking }: { stacking: boolean }): Promise<any>;
}

export const BalanceCard: FC<BalanceCardProps> = props => {
  const { address, onSelectReceive, onSelectSend, onRequestTestnetStx } = props;

  const [requestingTestnetStx, setRequestingTestnetStx] = useState(false);
  const { availableBalance, lockedBalance, totalBalance } = useBalance();

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
          <InternalLink href={makeExplorerAddressLink(address)} textStyle="caption" ml="tight">
            View on Explorer
          </InternalLink>
        )}
      </Flex>
      <Title fontSize="40px" lineHeight="56px">
        {totalBalance === null ? '–' : toHumanReadableStx(totalBalance.toString())}
      </Title>

      {features.stacking && lockedBalance !== null && lockedBalance.isGreaterThan(0) && (
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
          <Text>{toHumanReadableStx(lockedBalance.toString())} locked</Text>
          <Text children="·" mx="base-tight" />
          <Text>{toHumanReadableStx(availableBalance.toString())} available</Text>
        </Flex>
      )}
      <Box mt="loose">
        <Button
          size="md"
          onClick={onSelectSend}
          isDisabled={availableBalance.isEqualTo(0)}
          data-test={HomeSelectors.BtnSend}
        >
          <ArrowIcon size="12px" {...({ direction: 'up' } as any)} mr="base-tight" />
          Send
        </Button>
        <Button size="md" ml="tight" onClick={onSelectReceive} data-test={HomeSelectors.BtnReceive}>
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
