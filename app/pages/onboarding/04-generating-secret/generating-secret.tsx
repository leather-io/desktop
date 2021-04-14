import React from 'react';
import { Flex, Spinner } from '@stacks/ui';

import { Onboarding, OnboardingTitle } from '@components/onboarding';
import { useBackButton } from '@hooks/use-back-url';

export const GeneratingSecret: React.FC = () => {
  useBackButton(null);
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
