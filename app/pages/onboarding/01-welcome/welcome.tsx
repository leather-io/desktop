import React from 'react';
import { Text } from '@blockstack/ui';
import { Link, useHistory } from 'react-router-dom';

import routes from '../../../constants/routes.json';
import { OnboardingContainer } from '../../../components/onboarding-wrap';
import { OnboardingButton } from '../../../components/onboarding-button';
import { OnboardingTitle } from '../../../components/onboarding-title';

export const Welcome = () => {
  const history = useHistory();
  return (
    <OnboardingContainer>
      <OnboardingTitle>Stacks Wallet</OnboardingTitle>
      <Text display="block" textStyle="body.large" textAlign="center" color="ink" mt="base">
        Send, receive, and and earn Bitcoin rewards
      </Text>
      <Link to={routes.CREATE}>
        <OnboardingButton mt="extra-loose">Create a new wallet</OnboardingButton>
      </Link>
      <OnboardingButton mt="base" variant="outline" onClick={() => history.push(routes.CREATE)}>
        I already have a wallet
      </OnboardingButton>
    </OnboardingContainer>
  );
};
