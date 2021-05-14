import React from 'react';
import { Box, BoxProps } from '@stacks/ui';

export function StepsIcon(props: BoxProps) {
  return (
    <Box {...props}>
      <svg
        height="16"
        width="16"
        fill="none"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.5 3C9.5 2.44772 9.94771 2 10.5 2H15C15.5523 2 16 2.44772 16 3C16 3.55228 15.5523 4 15 4H11.5V8C11.5 8.55228 11.0523 9 10.5 9H6.5V13C6.5 13.5523 6.05228 14 5.5 14H1C0.447715 14 0 13.5523 0 13C0 12.4477 0.447715 12 1 12H4.5V8C4.5 7.44772 4.94772 7 5.5 7H9.5V3Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </Box>
  );
}
