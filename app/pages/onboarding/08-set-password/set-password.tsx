import React from 'react';
import { Onboarding, OnboardingTitle, OnboardingButton } from '../../../components/onboarding';
import { Input } from '@blockstack/ui';

export const SetPassword = () => {
  return (
    <Onboarding>
      <OnboardingTitle>Set a password</OnboardingTitle>
      <Input mt="extra-loose" />
      <OnboardingButton mt="loose">Continue</OnboardingButton>
    </Onboarding>
  );
};
