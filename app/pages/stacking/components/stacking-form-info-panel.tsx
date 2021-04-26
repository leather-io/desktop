import React, { FC } from 'react';
import { Flex, FlexProps } from '@stacks/ui';

type StackingFormInfoPanelProps = FlexProps;

export const StackingFormInfoPanel: FC<StackingFormInfoPanelProps> = props => (
  <Flex flexDirection="column" position="sticky" top="124px" {...props} />
);
