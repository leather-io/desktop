import { Flex, FlexProps } from '@stacks/ui';
import React from 'react';

export const OnboardingFooter: React.FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Flex flex={1} flexDirection="column" justifyContent="flex-end" {...props}>
      {children}
    </Flex>
  );
};
