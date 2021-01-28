import React, { FC } from 'react';
import { Flex, Box, Text } from '@blockstack/ui';

import failedCrossSvg from '@assets/images/failed-cross.svg';
import { WalletType } from '../../types/wallet-type';
interface StackingFailedProps {
  walletType: WalletType;
}

export const StackingFailed: FC<StackingFailedProps> = ({ children, walletType }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    textAlign="center"
    px="extra-loose"
    mb="extra-loose"
  >
    <Box mx="auto" my="extra-loose">
      <img src={failedCrossSvg} alt="" />
    </Box>
    <Text as="h1" textStyle="display.small" display="block">
      Unable to verify transaction
    </Text>
    {children && (
      <Text as="p" mt="base" mx="loose" display="block" textStyle="body.large">
        {children}
      </Text>
    )}
    {walletType === 'ledger' && (
      <Text textStyle="caption" color="ink.600" maxWidth="300px" mt="base">
        Make sure you're using the same Ledger device you used to create this wallet
      </Text>
    )}
  </Flex>
);
