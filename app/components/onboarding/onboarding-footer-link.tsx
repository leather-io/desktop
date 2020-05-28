import React from 'react';
import { Text, BoxProps } from '@blockstack/ui';

export const OnboardingFooterLink: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Text
      display="block"
      textStyle="body.small"
      color="ink.600"
      textDecoration="underline"
      textAlign="center"
      alignSelf="bottom"
      my="loose"
      cursor="pointer"
      {...props}
    >
      {children}
    </Text>
  );
};
