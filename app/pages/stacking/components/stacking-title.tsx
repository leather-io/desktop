import React, { FC } from 'react';
import { Text } from '@blockstack/ui';

export const StackingTitle: FC = ({ children }) => (
  <Text as="h1" display="block" fontSize="32px" textStyle="display.large">
    {children}
  </Text>
);
