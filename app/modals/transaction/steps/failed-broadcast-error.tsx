import React from 'react';
import { Flex, Box, Text } from '@blockstack/ui';

import failedCrossSvg from '../../../assets/images/failed-cross.svg';

export const FailedBroadcastError = () => (
  <Flex flexDirection="column" textAlign="center">
    <Box mx="auto" my="extra-loose">
      <img src={failedCrossSvg} alt="" />
    </Box>
    <Text as="h1" textStyle="display.small" display="block">
      Your transaction failed to verify
    </Text>
    <Text as="p" mt="base" mb="extra-loose" mx="loose" display="block" textStyle="body.large">
      ease make sure you are signing your transaction with the same Ledger or Secret Key used to set
      up your wallet.
    </Text>
  </Flex>
);
