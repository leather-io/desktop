import React from 'react';
import { color } from '@stacks/ui';

export const SuccessCheckmark: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="8" fill="#00A73E" />
    <path
      stroke={color('bg')}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M7.667 10.667l2 1.333 2.666-4"
    />
  </svg>
);
