import React, { FC } from 'react';
import { Box } from '@blockstack/ui';

interface DelegatedIconProps {
  size?: string;
}

export const DelegatedIcon: FC<DelegatedIconProps> = ({ size = '20px' }) => (
  <Box size={size}>
    <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11.4921" cy="10.1332" r="8.7582" stroke="#C5CCFF" strokeWidth="1.5" />
      <circle cx="17.7211" cy="16.3635" r="2.13934" fill="#7F80FF" stroke="white" />
      <circle cx="2.63934" cy="9.80585" r="2.13934" fill="#AAB3FF" stroke="white" />
      <circle cx="17.7211" cy="3.90253" r="2.13934" fill="#5546FF" stroke="white" />
    </svg>
  </Box>
);
