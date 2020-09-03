import React from 'react';
import { Spinner } from '@blockstack/ui';

import { Onboarding, OnboardingTitle } from '@components/onboarding';

export const GeneratingSecret: React.FC = () => {
  return (
    <Onboarding pt="152px">
      <Spinner size="lg" color="blue" alignSelf="center" />
      <OnboardingTitle textStyle="header.small" fontWeight={500} fontSize="20px" mt="loose">
        Generating your Secret Key
      </OnboardingTitle>
    </Onboarding>
  );
};
