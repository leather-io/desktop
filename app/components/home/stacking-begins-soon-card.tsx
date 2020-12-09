import React, { FC } from 'react';
import { Flex, Text, Box } from '@stacks/ui';
import { border } from '@utils/border';

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
    border={border()}
    px="loose"
    minHeight="180px"
  >
    <Box>
      <Text display="block" textStyle="body.small" color="ink.600" width="100%">
        Stacking will begin in the next cycle
      </Text>
      {blocksTillNextCycle && (
        <Text textStyle="caption" color="ink.600">
          {blocksTillNextCycle} block{blocksTillNextCycle > 1 && 's'} to go
        </Text>
      )}
    </Box>
  </Flex>
);
