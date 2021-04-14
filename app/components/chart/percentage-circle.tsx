import * as React from 'react';
import { Box, BoxProps } from '@stacks/ui';

export const blue = (alpha = 1, darker = false) =>
  `rgba(${darker ? '70,55,255' : '85,70,255'},${alpha})`;

export const PercentageCircle: React.FC<BoxProps & { percentage: number; size?: number }> = ({
  percentage,
  size = 64,
}) => {
  return (
    <Box>
      <svg width={size} height={size} strokeWidth={2} strokeLinecap="round" viewBox="0 0 36 36">
        <path
          fill="none"
          stroke={blue(0.1)}
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          fill="none"
          stroke="blue"
          strokeDasharray={`${percentage}, 100`}
          d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
    </Box>
  );
};
