import React from 'react';
import { Text, BoxProps } from '@blockstack/ui';

export const OnboardingText: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Text
      display="block"
      textStyle="body.large"
      textAlign="center"
      color="ink.900"
      mt="tight"
      {...props}
    >
      {children}
    </Text>
  );
};
