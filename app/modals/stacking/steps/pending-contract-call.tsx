import React, { FC } from 'react';
import { Flex, Spinner, Text } from '@blockstack/ui';

export const PendingContractCall: FC = () => (
  <Flex flexDirection="column" justifyContent="center" alignItems="center" py="80px">
    <Spinner size="md" color="blue" />
    <Text textStyle="body.large" color="ink" mt="extra-loose">
      Executing Stacking contract
    </Text>
  </Flex>
);
