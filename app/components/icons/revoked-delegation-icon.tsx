import React, { FC } from 'react';
import { Box } from '@blockstack/ui';

interface RevokedDelegationIconProps {
  size?: string;
}

export const RevokedDelegationIcon: FC<RevokedDelegationIconProps> = ({ size = '20px' }) => (
  <Box width={size} height={size}>
    <svg viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5082" cy="11.0689" r="8.7582" stroke="#C5CCFF" strokeWidth="1.5" />
      <path
        d="M1.17726 18.6768C0.68911 19.1649 0.68911 19.9564 1.17726 20.4446C1.66542 20.9327 2.45688 20.9327 2.94503 20.4446L19.945 3.44455C20.4332 2.9564 20.4332 2.16494 19.945 1.67678C19.4569 1.18863 18.6654 1.18863 18.1773 1.67678L1.17726 18.6768Z"
        fill="#C5CCFF"
        stroke="white"
        strokeLinecap="round"
      />
      <circle cx="11.1393" cy="19.5749" r="2.13934" fill="#7F80FF" stroke="white" />
      <circle cx="4.13934" cy="5.19989" r="2.13934" fill="#AAB3FF" stroke="white" />
      <circle cx="19.1393" cy="11.1999" r="2.13934" fill="#5546FF" stroke="white" />
    </svg>
  </Box>
);
