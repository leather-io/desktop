import React, { FC } from 'react';
import { Box, Text, color } from '@stacks/ui';

import { Screen } from '@components/screen';

export const SettingsLayout: FC = ({ children }) => (
  <Screen>
    <Box mt="68px">
      <Text
        color={color('text-title')}
        as="h1"
        textStyle="display.large"
        fontSize="32px"
        display="block"
      >
        Settings
      </Text>
      {children}
    </Box>
  </Screen>
);

export const SettingDescription: FC = ({ children }) => (
  <Text color={color('text-body')} as="h3" textStyle="body.large" mt="tight" display="block">
    {children}
  </Text>
);
