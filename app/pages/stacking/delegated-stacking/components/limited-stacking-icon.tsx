import React, { FC } from 'react';
import { Box, BoxProps } from '@stacks/ui';

interface LimitedStackingIconProps extends BoxProps {
  cycles: number;
}

export const LimitedStackingIcon: FC<LimitedStackingIconProps> = ({ cycles }) => {
  return (
    <Box>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path stroke="#5546FF" strokeWidth="2" d="M1 13h46v31a3 3 0 01-3 3H4a3 3 0 01-3-3V13z" />
        <path stroke="#5546FF" strokeWidth="2" d="M1 13h46V8a3 3 0 00-3-3H4a3 3 0 00-3 3v5z" />
        <path stroke="#5546FF" strokeLinecap="round" strokeWidth="2" d="M12 1v6M36 1v6" />
        <text
          fill="#5546FF"
          x="49%"
          y="62%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '16px' }}
        >
          {cycles}
        </text>
      </svg>
    </Box>
  );
};
