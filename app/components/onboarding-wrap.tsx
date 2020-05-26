import React from 'react';
import { Flex, Box } from '@blockstack/ui';

export const OnboardingContainer: React.FC = ({ children }) => {
  return (
    <Flex flexDirection="column" justifyContent="center" height="100%" maxWidth="424px" m="0 auto">
      <Box>{children}</Box>
    </Flex>
  );
};
