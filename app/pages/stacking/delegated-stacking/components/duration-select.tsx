import React, { FC } from 'react';
import { Box, BoxProps, color } from '@stacks/ui';

type DurationSelectProps = BoxProps;

export const DurationSelect: FC<DurationSelectProps> = props => (
  <Box
    mt="extra-loose"
    boxShadow="low"
    border={`1px solid ${color('border')}`}
    borderRadius="8px"
    width={[null, '432px']}
    {...props}
  />
);
