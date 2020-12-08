import React from 'react';
import { Box, Flex, FlexProps } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

export const Onboarding = forwardRefWithAs<FlexProps, 'div'>(({ children, ...props }, ref) => {
  return (
    <Flex
      position="relative"
      flexDirection="column"
      height="100%"
      maxWidth="424px"
      m="0 auto"
      ref={ref}
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
});
