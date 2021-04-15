import React from 'react';
import { Text, BoxProps, color } from '@stacks/ui';

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
