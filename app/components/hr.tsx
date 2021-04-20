import React from 'react';
import { Box, BoxProps, color } from '@stacks/ui';

export const Hr: React.FC<BoxProps> = props => {
  return <Box height="1px" width="100%" backgroundColor={color('border')} {...props} />;
};
