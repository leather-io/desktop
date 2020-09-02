import React, { FC } from 'react';
import { Flex, Box, Text } from '@blockstack/ui';

export const SettingsLayout: FC = ({ children }) => (
  <Flex
    flexDirection="column"
    maxWidth="960px"
    mb="extra-loose"
    mx={['loose', 'loose', 'extra-loose', 'auto']}
  >
    <Box mt="68px">
      <Text as="h1" textStyle="display.large" fontSize="32px" display="block">
        Settings
      </Text>
      {children}
    </Box>
  </Flex>
);

export const SettingDescription: FC = ({ children }) => (
  <Text as="h3" textStyle="body.large" mt="tight" display="block">
    {children}
  </Text>
);
