import { Text, BoxProps, color } from '@stacks/ui';
import React from 'react';

export const OnboardingFooterLink: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Text
      display="block"
      textStyle="body.small"
      color={color('text-caption')}
      textDecoration="underline"
      textAlign="center"
      alignSelf="bottom"
      mt="loose"
      cursor="pointer"
      {...props}
    >
      {children}
    </Text>
  );
};
