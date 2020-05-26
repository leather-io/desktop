import React from 'react';
import { Text, Input } from '@blockstack/ui';

import { OnboardingContainer } from '../../../components/onboarding-wrap';
import { OnboardingTitle } from '../../../components/onboarding-title';
import { OnboardingButton } from '../../../components/onboarding-button';
import { Hr } from '../../../components/hr';

export const RestoreWallet = () => {
  return (
    <OnboardingContainer>
      <OnboardingTitle>Restore your wallet</OnboardingTitle>
      <Text display="block" textStyle="body.large" textAlign="center" color="ink" mt="base">
        Restore your wallet by connecting your Ledger hardware wallet or a by entering your Secret
        Key
      </Text>
      <OnboardingButton mt="extra-loose">Continue with Ledger</OnboardingButton>
      <Hr my="extra-loose" />
      <Text textStyle="body.small.medium">Secret Key</Text>
      <Input
        as="textarea"
        mt="base-tight"
        height="88px"
        placeholder="24-word Secret Key"
        style={{ resize: 'none' }}
      />
      <OnboardingButton mt="loose">Continue with Secret Key</OnboardingButton>
    </OnboardingContainer>
  );
};
