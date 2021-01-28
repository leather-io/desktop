import React, { FC } from 'react';
import { BigNumber } from 'bignumber.js';
import dayjs from 'dayjs';

import { Flex, FlexProps, Text } from '@blockstack/ui';

import { Hr } from '@components/hr';

import { ExplainerTooltip } from '@components/tooltip';
import { toHumanReadableStx } from '@utils/unit-convert';

interface StackingInfoCardProps extends FlexProps {
  cycles: number;
  duration: string;
  startDate: Date;
  blocksPerCycle: number;
  balance: BigNumber | null;
}

export const DirectStackingInfoCard: FC<StackingInfoCardProps> = props => {
  const { cycles, duration, balance, blocksPerCycle, startDate } = props;

  const amountToBeStacked = balance === null ? new BigNumber(0) : balance;

  return (
    <Flex
      flexDirection="column"
      boxShadow="low"
      border="1px solid #F0F0F5"
      borderRadius="8px"
      minHeight="84px"
      alignItems="flex-start"
      minWidth={[null, null, '320px', '420px']}
      position="sticky"
      top="124px"
      {...props}
    >
      <Flex flexDirection="column" px={['loose', 'extra-loose']} pt="extra-loose" pb="base-loose">
        <Text textStyle="body.large.medium">You'll lock</Text>
        <Text fontSize="24px" fontWeight={600} letterSpacing="-0.04em" mt="extra-tight">
          {toHumanReadableStx(amountToBeStacked.toString())}
        </Text>
      </Flex>
      <Hr />
      <Flex flexDirection="column" px={['loose', 'extra-loose']} py="loose" width="100%">
        <Flex justifyContent="space-between">
          <Flex alignItems="center">
            <Text textStyle="body.large.medium" mr="tight">
              Cycles
            </Text>
            <ExplainerTooltip>
              One cycle lasts {blocksPerCycle} blocks on the Bitcoin blockchain
            </ExplainerTooltip>
          </Flex>
          <Text textAlign="right">{cycles}</Text>
        </Flex>
        <Flex justifyContent="space-between" mt="tight">
          <Flex alignItems="center">
            <Text textStyle="body.large.medium" mr="tight">
              Duration
            </Text>
            <ExplainerTooltip>
              The duration is an estimation that varies depending on the Bitcoin block time
            </ExplainerTooltip>
          </Flex>
          <Text textAlign="right">~{duration}</Text>
        </Flex>
        <Flex justifyContent="space-between" mt="tight">
          <Text textStyle="body.large.medium">Start date</Text>
          <Text textAlign="right">{dayjs(startDate).format('MMMM DD')}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
