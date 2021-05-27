import React from 'react';
import { Button, ButtonProps } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

export const OnboardingButton: ForwardRefExoticComponentWithAs<ButtonProps, 'button'> =
  forwardRefWithAs<ButtonProps, 'button'>(({ children, ...props }, ref) => (
    <Button mt="base" width="100%" type="button" size="md" ref={ref} {...props}>
      {children}
    </Button>
  ));
