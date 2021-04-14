import React, { FC } from 'react';
import { Box, Text } from '@stacks/ui';

interface SettingSectionProps {
  title: string;
}

export const SettingSection: FC<SettingSectionProps> = ({ title, children }) => (
  <Box as="section">
    <Text textStyle="display.small" mt="68px" display="block">
      {title}
    </Text>
    {children}
  </Box>
);
