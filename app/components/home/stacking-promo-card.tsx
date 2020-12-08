import React, { FC } from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';

import { openExternalLink } from '@utils/external-links';
import { BUY_STX_URL } from '@constants/index';
import { toHumanReadableStx } from '@utils/unit-convert';
import btcPodium from '../../assets/images/btc-podium.svg';

interface StackingPromoCardProps {
  minRequiredMicroStx: number;
}

export const StackingPromoCard: FC<StackingPromoCardProps> = ({ minRequiredMicroStx }) => (
  <Box
    mt="extra-loose"
    borderRadius="8px"
    boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
    border="1px solid #F0F0F5"
  >
    <Flex flexDirection="column" mt="40px" mb="extra-loose">
      <img src={btcPodium} />
      <Text display="block" textAlign="center" textStyle="display.small" mt="loose">
        Earn Bitcoin rewards with Stacking
      </Text>
      <Text display="block" mt="tight" textAlign="center" maxWidth="320px" mx="auto">
        You can earn Bitcoin by temporarily locking {toHumanReadableStx(minRequiredMicroStx)} or
        more
      </Text>
      <Button
        size="md"
        mt="base"
        mx="auto"
        width="272px"
        onClick={() => openExternalLink(BUY_STX_URL)}
      >
        Buy STX
      </Button>
    </Flex>
  </Box>
);
