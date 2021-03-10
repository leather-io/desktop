import React, { FC } from 'react';
import { Box, Flex, Text, ExclamationMarkCircleIcon } from '@blockstack/ui';
import { ClockIcon } from '@components/icons/clock';
import { DelegationIcon } from '@components/icons/delegation-icon';

export const DelegatedStackingTerms: FC = () => (
  <Box textStyle={['body.small', 'body.large']} mt="loose" borderLeft="4px solid #FE9000" pl="base">
    <Flex alignItems="start">
      <Box mr="base-tight" mt="5px">
        <DelegationIcon />
      </Box>
      <Text>
        Your delegation service will stack on your behalf and distribute BTC rewards. Hiro can’t
        help you if they don’t pay you your BTC rewards.
      </Text>
    </Flex>
    <Flex alignItems="start" mt="base-loose">
      <Box mr="base-tight" mt="4px">
        <ClockIcon />
      </Box>
      <Text>
        Your delegation service can lock your STX for up to 12 cycles, unless you've specified a
        cycle limit. You can revoke anytime, but your funds will be locked until all cycles finish.
      </Text>
    </Flex>
    <Flex alignItems="start" mt="base-loose">
      <Box mr="base-tight" mt="4px">
        <ExclamationMarkCircleIcon width="16px" />
      </Box>
      <Text>Make sure you’ve researched and trust the delegation service</Text>
    </Flex>
  </Box>
);
