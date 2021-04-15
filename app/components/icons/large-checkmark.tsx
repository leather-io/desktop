import React, { FC } from 'react';
import { Box, BoxProps } from '@stacks/ui';

type LargeCheckmarkProps = BoxProps;

export const LargeCheckmark: FC<LargeCheckmarkProps> = props => (
  <Box {...props}>
    <svg
      width="104"
      height="104"
      viewBox="0 0 104 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="52" cy="52" r="49" stroke="#C5CCFF" strokeWidth="6" />
      <path
        d="M28 50.7692L44.8 68L76 36"
        stroke="#3700FF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);
