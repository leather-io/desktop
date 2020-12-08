import React from 'react';
import { Box, BoxProps } from '@stacks/ui';

export const Hr: React.FC<BoxProps> = props => {
  return <Box height="1px" width="100%" backgroundColor="#F0F0F5" {...props} />;
};
