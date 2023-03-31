import { Text, BoxProps } from '@stacks/ui';
import React from 'react';

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
