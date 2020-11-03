import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import routes from '@constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '@components/onboarding';
import { useBackButton } from '@hooks/use-back-url';
import { ipcRenderer } from 'electron';

export const Welcome: React.FC = () => {
  const history = useHistory();
  useBackButton(null);

  useEffect(() => {
    console.log('setting effect');
    setInterval(() => {
      console.log('sending event');
      ipcRenderer.send('xxx');
    }, 3000);

    ipcRenderer.on('xxx-reply', () => console.log('logging local reply'));
  }, []);

  return (
    <Onboarding>
      <OnboardingTitle>Stacks Wallet</OnboardingTitle>
      <OnboardingText>
        Manage your STX holdings, and earn Bitcoin by participating in Stacking
      </OnboardingText>
      <OnboardingButton mt="extra-loose" onClick={() => history.push(routes.CREATE)}>
        Create a new wallet
      </OnboardingButton>
      <OnboardingButton onClick={() => history.push(routes.RESTORE)} mt="base" mode="secondary">
        I already have a wallet
      </OnboardingButton>
    </Onboarding>
  );
};
