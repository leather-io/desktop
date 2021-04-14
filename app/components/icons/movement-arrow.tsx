import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';

export const MovementArrow = ({ ...props }: BoxProps) => (
  <Box {...props}>
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <path
        d="M5.883 9.75h4.234a.5.5 0 00.429-.757L8.429 5.465a.5.5 0 00-.858 0L5.454 8.993a.5.5 0 00.43.757z"
        fill="#00A73E"
      />
      <circle opacity={0.24} cx={8} cy={8} r={7} stroke="#00A73E" strokeWidth={2} />
    </svg>
  </Box>
);
