import React, { FC } from 'react';
import { Box, BoxProps } from '@stacks/ui';

export const SettingsButton: FC<BoxProps> = props => {
  return (
    <Box
      as="button"
      fontWeight="regular"
      textStyle="body.small"
      p="tight"
      cursor="default"
      _focus={{ textDecoration: 'underline', outline: 0 }}
      data-test="btn-settings"
      {...props}
    >
      Settings
    </Box>
  );
};
