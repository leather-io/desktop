import React, { FC } from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import { Hr } from '../hr';
import { MovementArrow } from '../icons/movement-arrow';
import { features } from '@constants/index';

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
      border="1px solid #F0F0F5"
    >
      <Flex height="58px" alignItems="center" borderBottom="1px solid #F0F0F5">
        <Flex px="loose" alignItems="baseline" justifyContent="space-between" width="100%">
          <Text textStyle="body.large.medium">Stacking rewards</Text>
          <Box textStyle="caption">
            <Text color="#747478" mr="extra-tight">
              For address
            </Text>
            <Text color="blue">sldkjf</Text>
          </Box>
        </Flex>
      </Flex>
      <Box mx="loose">
        <Flex my="loose" flexDirection="column">
          <Text textStyle="body.small" color="ink.600">
            Lifetime rewards
          </Text>
          <Flex mt="tight" alignItems="center">
            <MovementArrow mr="tight" />
            <Text textStyle="body.large.medium">{lifetime}</Text>
          </Flex>
        </Flex>
        <Hr />
        <Flex my="loose" flexDirection="column">
          <Text textStyle="body.small" color="ink.600">
            Last cycle
          </Text>
          <Flex mt="tight" alignItems="center">
            <MovementArrow mr="tight" />
            <Text textStyle="body.large.medium">{lastCycle}</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
