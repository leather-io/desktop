import React from 'react';
import { Text, BoxProps } from '@stacks/ui';

export const OnboardingTitle: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Text
      as="h1"
      textStyle="display.large"
      display="block"
      textAlign="center"
      fontSize="40px"
      lineHeight="56px"
      {...props}
    >
      {children}
    </Text>
  );
};
