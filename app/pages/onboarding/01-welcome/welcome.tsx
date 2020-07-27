import React from 'react';
import { useHistory } from 'react-router-dom';

import routes from '../../../constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '../../../components/onboarding';

export const Welcome: React.FC = () => {
  const history = useHistory();
  return (
    <Onboarding>
      <OnboardingTitle>Stacks Wallet</OnboardingTitle>
      <OnboardingText>Send STX, receive STX, and earn Bitcoin rewards</OnboardingText>
      <OnboardingButton mt="extra-loose" onClick={() => history.push(routes.CREATE)}>
        Create a new wallet
      </OnboardingButton>
      <OnboardingButton onClick={() => history.push(routes.RESTORE)} mt="base" mode="secondary">
        I already have a wallet
      </OnboardingButton>
    </Onboarding>
  );
};
