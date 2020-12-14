import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Box, Text } from '@blockstack/ui';

import { WaffleChart } from '@components/chart/waffle-chart';
import { RootState } from '@store/index';
import {
  selectStackerInfo,
  selectNextCycleInfo,
  selectPoxInfo,
} from '../../store/stacking/stacking.reducer';

type StackingCardProps = any;

export const StackingCard: FC<StackingCardProps> = () => {
  const { stackingDetails, stackerInfo, nextCycleInfo } = useSelector((state: RootState) => ({
    stackingDetails: selectPoxInfo(state),
    stackerInfo: selectStackerInfo(state),
    nextCycleInfo: selectNextCycleInfo(state),
  }));

  return (
    <Flex
      flexDirection="column"
      mt="extra-loose"
      borderRadius="8px"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
      border="1px solid #F0F0F5"
      px="loose"
      minHeight="180px"
    >
      {stackerInfo?.isCurrentlyStacking && (
        <Box>
          <Text display="block" textStyle="body.large.medium" mt="base-loose" textAlign="center">
            Stacking progress
          </Text>
          <Flex justifyContent="space-between" mt="base">
            <Text textStyle="body.small.medium">Current stacking cycle</Text>
          </Flex>
          <Flex
            maxWidth={[null, null, '325px']}
            flexWrap="wrap"
            alignContent="flex-start"
            mt="tight"
          >
            <WaffleChart
              points={[
                ...Array.from({
                  length:
                    (stackingDetails?.reward_cycle_length || 0) -
                    (nextCycleInfo?.blocksToNextCycle || 0),
                }).map(() => true),
                ...Array.from({ length: nextCycleInfo?.blocksToNextCycle || 0 }).map(() => false),
              ]}
            />
          </Flex>
          <Box mr="2px">
            <Flex justifyContent="space-between" mt="base">
              <Text textStyle="body.small.medium">Blocks until next cycle</Text>
              <Text textStyle="body.small">{nextCycleInfo?.blocksToNextCycle}</Text>
            </Flex>
            <Flex justifyContent="space-between" mt="tight">
              <Text textStyle="body.small.medium">You're stacking for</Text>
              <Text textStyle="body.small">
                {stackerInfo?.lock_period} cycle{stackerInfo.lock_period > 1 ? 's' : ''}
              </Text>
            </Flex>
            {stackerInfo.lock_period > 1 && (
              <Flex justifyContent="space-between" mt="tight">
                <Text textStyle="body.small.medium">Current cycle</Text>
                <Text textStyle="body.small">
                  {stackerInfo.currentCycleOfTotal} of {stackerInfo?.lock_period}
                </Text>
              </Flex>
            )}
            {/* <Flex flexDirection="column" mt="tight" mb="base-loose">
              <Text textStyle="body.small.medium">Reward to be paid to</Text>
              <Text as="code" fontSize="13px" mt="tight" color="ink.600">
                {stackerInfo?.pox_address}
              </Text>
            </Flex> */}
          </Box>
        </Box>
      )}
    </Flex>
  );
};
