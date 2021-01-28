import React, { FC } from 'react';
import { Box, Flex, Text, EncryptionIcon } from '@blockstack/ui';
import { ClockIcon } from '@components/icons/clock';
import { RewindArrow } from '@components/icons/rewind-arrow';

interface StackingTermsProps {
  timeUntilNextCycle: string;
  estimatedDuration: string;
}
export const StackingTerms: FC<StackingTermsProps> = props => {
  const { timeUntilNextCycle, estimatedDuration } = props;
  return (
    <Box textStyle={['body.small', 'body.large']} mt="loose">
      <Flex alignItems="center">
        <Box width={['12px', '16px']} mr="base-tight">
          <EncryptionIcon width={['12px', '16px']} />
        </Box>
        <Text>
          Your STX will be locked for ~{estimatedDuration}, starting in about {timeUntilNextCycle}
        </Text>
      </Flex>
      <Flex alignItems="center" mt="base-loose">
        <Box width={['12px', '16px']} mr="base-tight">
          <ClockIcon />
        </Box>
        <Text>The duration can vary depending on the Bitcoin block time</Text>
      </Flex>
      <Flex alignItems="center" mt="base-loose">
        <Box width={['12px', '16px']} mr="base-tight">
          <RewindArrow />
        </Box>
        <Text>This transaction can not be reversed</Text>
      </Flex>
    </Box>
  );
};
