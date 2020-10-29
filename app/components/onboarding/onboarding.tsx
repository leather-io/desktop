import React from 'react';
import { Flex, FlexProps, Box } from '@blockstack/ui';

export const Onboarding: React.FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Flex
      position="relative"
      flexDirection="column"
      height="100%"
      maxWidth="424px"
      m="0 auto"
      {...props}
    >
      <Flex
        py="extra-loose"
        height="calc(100% - 44px)"
        minHeight="min-content"
        flexDirection="row"
        alignItems="center"
      >
        <Box width="100%">{children}</Box>
      </Flex>
    </Flex>
  );
};
