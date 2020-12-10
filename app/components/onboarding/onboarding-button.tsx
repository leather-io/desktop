import React from 'react';
import { Button, ButtonProps } from '@stacks/ui';

type OnboardingButton = Omit<ButtonProps, 'ref'>;

export const OnboardingButton: React.FC<OnboardingButton> = ({ children, ...props }) => (
  <Button mt="base" width="100%" type="button" size="md" {...props}>
    {children}
  </Button>
);
