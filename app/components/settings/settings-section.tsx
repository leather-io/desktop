import React, { FC } from 'react';
import { Box, color, Text } from '@stacks/ui';

interface SettingSectionProps {
  title: string;
}

export const SettingSection: FC<SettingSectionProps> = ({ title, children }) => (
  <Box color={color('text-body')} as="section">
    <Text color={color('text-title')} textStyle="display.small" mt="68px" display="block">
      {title}
    </Text>
    {children}
  </Box>
);
