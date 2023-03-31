import { Flex, FlexProps } from '@stacks/ui';
import React, { FC } from 'react';

export const StackingFormInfoPanel: FC<FlexProps> = props => (
  <Flex
    flexDirection="column"
    position="sticky"
    minWidth={[null, null, '360px', '420px']}
    top="124px"
    {...props}
  />
);
