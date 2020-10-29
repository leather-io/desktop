import React, { FC } from 'react';
import { Text, BoxProps } from '@blockstack/ui';

export const StackingDescription: FC<BoxProps> = ({ children, ...props }) => (
  <Text textStyle="body.large" display="block" {...props}>
    {children}
  </Text>
);
