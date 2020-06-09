import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { onboardingMnemonicGenerationStep } from '../../../store/keys/keys.actions';
import routes from '../../../constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
  OnboardingFooter,
  OnboardingFooterLink,
} from '../../../components/onboarding';

export const CreateWallet: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const createSoftwareWallet = () => {
    dispatch(onboardingMnemonicGenerationStep({ stepDelayMs: 1_500 }));
    history.push(routes.GENERATING);
  };

  return (
    <Onboarding>
      <OnboardingTitle>Create a new wallet</OnboardingTitle>
      <OnboardingText>
        Please choose whether you’d like to connect a Ledger hardware wallet or to create a software
        wallet
      </OnboardingText>
      <OnboardingButton mt="extra-loose">Use a Ledger wallet</OnboardingButton>

      <OnboardingButton onClick={createSoftwareWallet} mode="alternate">
        Create a software wallet
      </OnboardingButton>

      <OnboardingFooter>
        <OnboardingFooterLink>I have a Trezor wallet</OnboardingFooterLink>
      </OnboardingFooter>
    </Onboarding>
  );
};
