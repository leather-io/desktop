import React, { FC } from 'react';
import { Flex, Text, Box, color } from '@stacks/ui';

interface StackingBeginsSoonCardProps {
  blocksTillNextCycle?: number;
}

export const StackingBeginsSoonCard: FC<StackingBeginsSoonCardProps> = ({
  blocksTillNextCycle,
}) => (
  <Flex
    flexDirection="column"
    flex={1}
    justifyContent="center"
    textAlign="center"
    alignItems="center"
    mt="extra-loose"
    borderRadius="8px"
    boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
    border={`1px solid ${color('border')}`}
    px="loose"
    minHeight="180px"
  >
    <Box>
      <Text display="block" textStyle="body.small" color={color('text-caption')} width="100%">
        Stacking will begin in the next cycle
      </Text>
      {typeof blocksTillNextCycle === 'number' ? (
        <Text textStyle="caption" color={color('text-caption')}>
          {blocksTillNextCycle} block{blocksTillNextCycle > 1 && 's'} to go
        </Text>
      ) : null}
    </Box>
  </Flex>
);
