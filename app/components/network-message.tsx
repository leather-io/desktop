import React, { FC } from 'react';
import { Text, Box } from '@blockstack/ui';

// import { ENV } from '@constants/index';

interface NetworkMessageProps {
  textColor?: string;
}

export const NetworkMessage: FC<NetworkMessageProps> = ({ textColor }) => {
  // if (ENV === 'production') return null;
  return (
    <Box display={['none', 'block']} position="absolute" ml="50%" left="-45px" top="9px">
      <Box
        width="8px"
        height="8px"
        borderRadius="50%"
        backgroundColor={textColor ? textColor : '#F9A14D'}
        position="absolute"
        left="-14px"
        top="9px"
      />
      <Text as="h3" textStyle="body.small.medium" color={textColor ? textColor : '#F9A14D'}>
        Testnet mode
      </Text>
    </Box>
  );
};
