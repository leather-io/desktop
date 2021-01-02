import React, { FC } from 'react';
import { Flex, Text } from '@blockstack/ui';

export const StackingError: FC = () => (
  <Flex
    flexDirection="column"
    flex={1}
    justifyContent="center"
    textAlign="center"
    alignItems="center"
    mt="extra-loose"
    borderRadius="8px"
    boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
    border="1px solid #F0F0F5"
    px="loose"
    minHeight="180px"
  >
    <Flex>
      <Text display="block" textStyle="body.small" color="ink.600" width="100%">
        Unable to fetch stacking details
      </Text>
    </Flex>
  </Flex>
);
