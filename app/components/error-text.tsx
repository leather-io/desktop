import { Text, color } from '@stacks/ui';
import type { BoxProps } from '@stacks/ui';
import React from 'react';

export const ErrorText: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    textAlign="left"
    lineHeight="16px"
    display="block"
    textStyle="caption"
    color={color('feedback-error')}
    {...rest}
  >
    {children}
  </Text>
);
