import React, { FC } from 'react';
import { Box, BoxProps, color } from '@stacks/ui';

type CircleButtonProps = BoxProps;

export const CircleButton: FC<CircleButtonProps> = props => (
  <Box
    as="button"
    {...{ type: 'button' }}
    backgroundColor={color('bg-4')}
    _hover={{ color: color('brand') }}
    style={{ userSelect: 'none' }}
    display="inline-block"
    width="28px"
    height="28px"
    borderRadius="50%"
    fontWeight={800}
    outline={0}
    {...props}
  />
);
