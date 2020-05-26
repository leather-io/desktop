import React from 'react';
import { Text, BoxProps } from '@blockstack/ui';

export const OnboardingTitle: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Text
      display="block"
      textAlign="center"
      fontSize="40px"
      fontWeight="600"
      color="ink"
      lineHeight="56px"
      {...props}
    >
      {children}
    </Text>
  );
};
