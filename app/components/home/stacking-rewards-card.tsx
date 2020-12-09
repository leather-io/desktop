import React, { FC } from 'react';
import { Box, color, Flex, Text } from '@stacks/ui';
import { Hr } from '../hr';
import { MovementArrow } from '../icons/movement-arrow';
import { features } from '@constants/index';
import { border } from '@utils/border';

interface StackingRewardCardProps {
  lifetime: string;
  lastCycle: string;
}

export const StackingRewardCard: FC<StackingRewardCardProps> = ({ lifetime, lastCycle }) => {
  if (!features.stacking || !features.lifetimeRewards) return null;
  return (
    <Box
      mt="extra-loose"
      borderRadius="8px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
      border={border()}
    >
      <Flex m="loose" flexDirection="column">
        <Text textStyle="body.small" color={color('text-title')}>
          Lifetime rewards
        </Text>
        <Flex mt="tight" alignItems="center">
          <MovementArrow mr="tight" />
          <Text textStyle="body.large.medium">{lifetime}</Text>
        </Flex>
      </Flex>
      <Hr />
      <Flex m="loose" flexDirection="column">
        <Text textStyle="body.small" color="ink.600">
          Last cycle
        </Text>
        <Flex mt="tight" alignItems="center">
          <MovementArrow mr="tight" />
          <Text textStyle="body.large.medium">{lastCycle}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};
