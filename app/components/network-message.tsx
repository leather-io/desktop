import React from 'react';
import { Text, Box } from '@blockstack/ui';

import { ENV } from '../constants/index';

export const NetworkMessage = () => {
  if (ENV === 'production') return null;
  return (
    <Box position="relative" mt="tight">
      <Box
        width="8px"
        height="8px"
        borderRadius="50%"
        backgroundColor="#F9A14D"
        position="absolute"
        left="-14px"
        top="9px"
      />
      <Text as="h3" textStyle="body.small.medium" color="#F9A14D">
        Testnet mode
      </Text>
    </Box>
  );
};
