import React from 'react';
import { Button, ButtonProps } from '@blockstack/ui';

type OnboardingButton = Omit<ButtonProps, 'ref'>;

export const OnboardingButton: React.FC<OnboardingButton> = ({ children, ...props }) => (
  <Button mt="base" width="100%" type="button" {...props}>
    {children}
  </Button>
);
