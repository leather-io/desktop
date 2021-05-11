import { BoxProps } from '@stacks/ui';
import React from 'react';

interface ClockIconProps extends BoxProps {
  size: string;
}

export const ClockIcon: React.FC<ClockIconProps> = ({ size = '16px' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.00378 16C12.3907 16 16 12.3983 16 8.00378C16 3.60925 12.3907 0 7.99622 0C3.6017 0 0 3.60925 0 8.00378C0 12.3983 3.60925 16 8.00378 16ZM4.45493 9.18924C4.03209 9.18924 3.70741 8.85701 3.70741 8.43417C3.70741 8.01888 4.03209 7.68664 4.45493 7.68664H7.2487V3.78292C7.2487 3.36008 7.58093 3.03539 7.99622 3.03539C8.41907 3.03539 8.74375 3.36008 8.74375 3.78292V8.43417C8.74375 8.85701 8.41907 9.18924 7.99622 9.18924H4.45493Z"
      fill="currentColor"
    />
  </svg>
);
