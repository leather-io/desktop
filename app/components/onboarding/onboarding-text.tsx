import { Text, BoxProps, color } from '@stacks/ui';
import React from 'react';

export const OnboardingText: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Text
      display="block"
      textStyle="body.large"
      textAlign="center"
      color={color('text-title')}
      mt="tight"
      {...props}
    >
      {children}
    </Text>
  );
};
