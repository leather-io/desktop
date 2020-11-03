import React, { FC } from 'react';
import { Flex, Text, Box } from '@blockstack/ui';

interface StackingBeginsSoonCardProps {
  blocksTillNextCycle?: number;
}

export const StackingBeginsSoonCard: FC<StackingBeginsSoonCardProps> = ({
  blocksTillNextCycle,
}) => (
  <Flex flexDirection="column" flex={1} justifyContent="center" textAlign="center">
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
