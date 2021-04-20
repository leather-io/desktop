import React, { FC } from 'react';
import { Flex, Text, FlexProps, color } from '@stacks/ui';

import { CalendarIcon } from '@components/icons/calendar-circle';

interface NextCycleInfoProps extends FlexProps {
  timeUntilNextCycle: string;
}

export const NextCycleInfo: FC<NextCycleInfoProps> = ({ timeUntilNextCycle, ...props }) => (
  <Flex
    boxShadow="low"
    border={`1px solid ${color('border')}`}
    borderRadius="8px"
    minHeight="84px"
    alignItems="center"
    px="loose"
    py="base-tight"
    {...props}
  >
    <CalendarIcon display={['none', 'flex']} mr="base" />
    <Flex flexDirection="column" justifyContent="space-evenly">
      <Text display="block" textStyle="body.large.medium" lineHeight="20px">
        Next cycle starts in about {timeUntilNextCycle}
      </Text>
      <Text display="block" textStyle="body.small" color={color('text-caption')} mt="extra-tight">
        Lock your STX for a chance to earn Bitcoin when the next cycle starts
      </Text>
    </Flex>
  </Flex>
);
