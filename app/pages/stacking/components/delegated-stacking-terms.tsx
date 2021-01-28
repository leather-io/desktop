import React, { FC } from 'react';
import { Box, Flex, Text, ExclamationMarkCircleIcon } from '@blockstack/ui';
import { ClockIcon } from '@components/icons/clock';
import { DelegationIcon } from '@components/icons/delegation-icon';

export const DelegatedStackingTerms: FC = () => (
  <Box textStyle={['body.small', 'body.large']} mt="loose">
    <Flex alignItems="center">
      <Box mr="base-tight">
        <DelegationIcon />
      </Box>
      <Text>Your delegator will stack on your behalf</Text>
    </Flex>
    <Flex alignItems="center" mt="base-loose">
      <Box mr="base-tight">
        <ClockIcon />
      </Box>
      <Text>You’ll STX will be delegated indefinitely until you cancel</Text>
    </Flex>
    <Flex alignItems="center" mt="base-loose">
      <Box mr="base-tight">
        <ExclamationMarkCircleIcon width="16px" />
      </Box>
      <Text>Make sure you’ve researched and trust the delegation service</Text>
    </Flex>
  </Box>
);
