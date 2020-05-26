import React from 'react';
import { Text } from '@blockstack/ui';

import { OnboardingContainer } from '../../../components/onboarding-wrap';
import { OnboardingTitle } from '../../../components/onboarding-title';
import { OnboardingButton } from '../../../components/onboarding-button';

export const CreateWallet = () => {
  return (
    <OnboardingContainer>
      <OnboardingTitle>Create a new wallet</OnboardingTitle>
      <Text display="block" textStyle="body.large" textAlign="center" color="ink" mt="base">
        Please choose whether you’d like to connect a Ledger hardware wallet or to create a software
        wallet
      </Text>
      <OnboardingButton mt="extra-loose">Use a Ledger wallet</OnboardingButton>
      <OnboardingButton>Create a software wallet</OnboardingButton>
    </OnboardingContainer>
  );
};
