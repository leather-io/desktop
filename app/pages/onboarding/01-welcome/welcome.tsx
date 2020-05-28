import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../../../constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '../../../components/onboarding';

export const Welcome = () => {
  return (
    <Onboarding>
      <OnboardingTitle>Stacks Wallet</OnboardingTitle>
      <OnboardingText>Send, receive, and and earn Bitcoin rewards</OnboardingText>
      <Link to={routes.CREATE}>
        <OnboardingButton mt="extra-loose">Create a new wallet</OnboardingButton>
      </Link>
      <Link to={routes.RESTORE}>
        <OnboardingButton mt="base" variant="outline">
          I already have a wallet
        </OnboardingButton>
      </Link>
    </Onboarding>
  );
};
