import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../../../constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
  OnboardingFooter,
  OnboardingFooterLink,
} from '../../../components/onboarding';

export const CreateWallet = () => {
  return (
    <Onboarding>
      <OnboardingTitle>Create a new wallet</OnboardingTitle>
      <OnboardingText>
        Please choose whether you’d like to connect a Ledger hardware wallet or to create a software
        wallet
      </OnboardingText>
      <OnboardingButton mt="extra-loose">Use a Ledger wallet</OnboardingButton>
      <Link to={routes.GENERATING}>
        <OnboardingButton>Create a software wallet</OnboardingButton>
      </Link>
      <OnboardingFooter>
        <OnboardingFooterLink>I have a Trezor wallet</OnboardingFooterLink>
      </OnboardingFooter>
    </Onboarding>
  );
};
