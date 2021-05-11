import React, { FC } from 'react';
import { Box, BoxProps } from '@stacks/ui';

export const IndefiniteStackingIcon: FC<BoxProps> = props => {
  return (
    <Box {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          stroke="#5546FF"
          strokeWidth="2"
          d="M1 13h46v31a3 3 0 01-3 3H4a3 3 0 01-3-3V13zM1 13h46V8a3 3 0 00-3-3H4a3 3 0 00-3 3v5z"
        />
        <g clipPath="url(#clip0)">
          <path
            fill="#5546FF"
            d="M21.233 22.494a8 8 0 018.22 1.652l.84-.84c.63-.63 1.707-.184 1.707.707V28h-3.987c-.891 0-1.337-1.077-.707-1.707l.731-.732a6 6 0 101.378 7.024 1 1 0 011.805.861 8 8 0 11-9.987-10.952z"
          />
        </g>
        <path stroke="#5546FF" strokeLinecap="round" strokeWidth="2" d="M12 1v6M36 1v6" />
        <defs>
          <clipPath id="clip0">
            <path fill="#fff" d="M0 0H16V16H0z" transform="matrix(1 0 0 -1 16 38)" />
          </clipPath>
        </defs>
      </svg>
    </Box>
  );
};
