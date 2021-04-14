import React from 'react';
import { Flex, FlexProps, Box } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

export const Onboarding: ForwardRefExoticComponentWithAs<FlexProps, 'div'> = forwardRefWithAs<
  FlexProps,
  'div'
>(({ children, ...props }, ref) => {
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
        <Box width="100%" maxHeight="100%">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
});
