import React, { FC } from 'react';
import { Flex, FlexProps } from '@stacks/ui';

export const StackingFormInfoPanel: FC<FlexProps> = props => (
  <Flex flexDirection="column" position="sticky" top="124px" {...props} />
);
