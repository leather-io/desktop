import React, { FC } from 'react';
import { Box, BoxProps } from '@blockstack/ui';

type CircleButtonProps = BoxProps;

export const CircleButton: FC<CircleButtonProps> = props => (
  <Box
    as="button"
    {...{ type: 'button' }}
    backgroundColor="ink.150"
    _hover={{ backgroundColor: 'ink.200' }}
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
