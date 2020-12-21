import React, { FC } from 'react';
import { Text, Box } from '@blockstack/ui';

import { NETWORK } from '@constants/index';

interface NetworkMessageProps {
  textColor?: string;
}

export const NetworkMessage: FC<NetworkMessageProps> = ({ textColor }) => {
  if (NETWORK === 'mainnet') return null;
  return (
    <Box top="9px">
      <Box display={['none', 'block']} pl="base" position="relative">
        <Box
          width="8px"
          height="8px"
          borderRadius="50%"
          backgroundColor={textColor ? textColor : '#F9A14D'}
          position="absolute"
          left={0}
          top="9px"
        />
        <Text as="h3" textStyle="body.small.medium" color={textColor ? textColor : '#F9A14D'}>
          Testnet mode
        </Text>
      </Box>
    </Box>
  );
};
