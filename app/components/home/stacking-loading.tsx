import React, { FC } from 'react';
import { Flex, Spinner } from '@stacks/ui';

export const StackingLoading: FC = () => (
  <Flex
    alignItems="center"
    justifyContent="center"
    mt="extra-loose"
    borderRadius="8px"
    boxShadow="0px 1px 2px rgba(0, 0, 0, 0.04);"
    border="1px solid #F0F0F5"
    px="loose"
    minHeight="180px"
  >
    <Spinner size="sm" color="ink.300" />
  </Flex>
);
