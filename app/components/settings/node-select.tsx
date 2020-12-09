import React, { FC } from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { border } from '@utils/border';

type NodeSelectProps = BoxProps;

export const NodeSelect: FC<NodeSelectProps> = props => (
  <Box
    mt="extra-loose"
    boxShadow="low"
    border={border()}
    borderRadius="8px"
    width={['unset', '432px']}
    {...props}
  />
);
