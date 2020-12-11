import React, { FC } from 'react';
import { Flex, Text, FlexProps, color } from '@stacks/ui';
import { border } from '@utils/border';

import { CalendarIcon } from '@components/icons/calendar-circle';

interface NextCycleInfoProps extends FlexProps {
  timeUntilNextCycle: string;
}

export const NextCycleInfo: FC<NextCycleInfoProps> = ({ timeUntilNextCycle, ...props }) => (
  <Flex
    boxShadow="low"
    border={border()}
    bg={color('bg-2')}
    borderRadius="8px"
    minHeight="84px"
    alignItems="center"
    px="loose"
    py="base-tight"
    {...props}
  >
    <CalendarIcon display={['none', 'flex']} mr="base" />
    <Flex flexDirection="column" justifyContent="space-evenly">
      <Text display="block" textStyle="body.large.medium" fontWeight={500} lineHeight="20px">
        Next cycle starts in {timeUntilNextCycle}
      </Text>
      <Text display="block" textStyle="body.small" color={color('text-body')} mt="extra-tight">
        Lock your STX for a chance to earn Bitcoin when the next cycle starts.
      </Text>
    </Flex>
  </Flex>
);
