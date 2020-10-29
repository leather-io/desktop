import React from 'react';
import { Flex, Spinner } from '@blockstack/ui';

import { Onboarding, OnboardingTitle } from '@components/onboarding';

export const GeneratingSecret: React.FC = () => {
  return (
    <Onboarding>
      <Flex>
        <Spinner size="lg" color="blue" mx="auto" />
      </Flex>
      <OnboardingTitle textStyle="header.small" fontWeight={500} fontSize="20px" mt="loose">
        Generating your Secret Key
      </OnboardingTitle>
    </Onboarding>
  );
};
