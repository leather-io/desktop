import React, { FC } from 'react';
import { Flex, Text } from '@blockstack/ui';
import { LargeCheckmark } from '@components/icons/large-checkmark';

export const StackingSuccess: FC = () => (
  <Flex flexDirection="column" textAlign="center" py="extra-loose">
    <Flex justifyContent="center">
      <LargeCheckmark />
    </Flex>
    <Text textStyle="display.small" display="block" textAlign="center" mt="extra-loose">
      You locked your STX for 2 weeks
    </Text>
    <Text
      textStyle="body.large"
      display="block"
      textAlign="center"
      mt="base-tight"
      mx="extra-loose"
    >
      You’ll receive Bitcoin twice, at the end of every cycle.
    </Text>
  </Flex>
);
