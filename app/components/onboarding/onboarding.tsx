import React from 'react';
import { Flex, FlexProps } from '@blockstack/ui';

export const Onboarding: React.FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Flex flexDirection="column" height="100%" maxWidth="424px" m="0 auto" {...props}>
      <Flex mt="152px" height="100%" flexDirection="column">
        {children}
      </Flex>
    </Flex>
  );
};
