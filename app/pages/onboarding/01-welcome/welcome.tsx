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
import { useInterval } from '../../../hooks/use-interval';

export const Welcome: React.FC = () => {
  const history = useHistory();
  useBackButton(null);

  // useInterval(() => {
  //   function run() {
  //     api.store.send(
  //       writeUnprotectedConfigRequest,
  //       (Math.random() * 100).toString(),
  //       (Math.random() * 100).toString()
  //     );
  //   }
  //   void run();
  // }, 5000);

  useEffect(() => {
    console.log('running once ');

    console.log(api.store.initial());
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
