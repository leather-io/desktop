import React, { FC } from 'react';
import { Box, BoxProps } from '@blockstack/ui';

export const SettingsButton: FC<BoxProps> = props => {
  return (
    <Box
      as="button"
      fontWeight="regular"
      textStyle="body.small"
      p="tight"
      mt="4px"
      mr="tight"
      cursor="default"
      _focus={{ textDecoration: 'underline', outline: 0 }}
      {...props}
    >
      Settings
    </Box>
  );
};
