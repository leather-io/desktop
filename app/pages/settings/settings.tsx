import React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import { useBackButton } from '../../hooks/use-back-url.hook';
import routes from '../../constants/routes.json';

export const Settings = () => {
  useBackButton(routes.HOME);
  return (
    <Flex>
      <Box>
        <Text as="h1">Node settings</Text>
        <Text as="h3">Select the node you'd like to use</Text>
      </Box>
    </Flex>
  );
};
