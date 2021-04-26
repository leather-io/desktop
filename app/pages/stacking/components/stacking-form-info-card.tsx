import React, { FC } from 'react';
import { color, Flex, FlexProps } from '@stacks/ui';

type StackingFormInfoCardProps = FlexProps;

export const StackingFormInfoCard: FC<StackingFormInfoCardProps> = props => (
  <Flex
    flexDirection="column"
    boxShadow="low"
    border={`1px solid ${color('border')}`}
    borderRadius="8px"
    minHeight="84px"
    minWidth={[null, null, '320px', '420px']}
    {...props}
  />
);
