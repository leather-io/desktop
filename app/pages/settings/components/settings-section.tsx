import React, { FC } from 'react';
import { Box, Text, BoxProps } from '@stacks/ui';

interface SettingSectionProps extends BoxProps {
  title: string;
}

export const SettingSection: FC<SettingSectionProps> = ({ title, children, ...props }) => (
  <Box as="section" {...props}>
    <Text textStyle="display.small" mt="68px" display="block">
      {title}
    </Text>
    {children}
  </Box>
);
