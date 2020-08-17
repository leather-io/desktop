import React from 'react';
import { Button, ButtonProps, ArrowIcon } from '@blockstack/ui';

type OnboardingBackButton = Omit<ButtonProps, 'ref' | 'children'>;

export const OnboardingBackButton: React.FC<OnboardingBackButton> = props => (
  <Button
    variant="solid"
    mode="tertiary"
    width="32px"
    height="32px"
    type="button"
    top="60px"
    left="20px"
    style={{
      position: 'absolute',
    }}
    {...props}
  >
    <ArrowIcon direction="left" size="12px" />
  </Button>
);
