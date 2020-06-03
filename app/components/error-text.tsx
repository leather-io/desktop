import React from 'react';
import { Text, BoxProps } from '@blockstack/ui';

export const ErrorText: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    textAlign="left"
    lineHeight="16px"
    display="block"
    textStyle="caption"
    color="feedback.error"
    {...rest}
  >
    {children}
  </Text>
);
