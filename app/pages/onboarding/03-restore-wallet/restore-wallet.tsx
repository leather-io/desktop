import React from 'react';
import { Text, Input } from '@blockstack/ui';

import { Hr } from '../../../components/hr';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
  OnboardingFooter,
  OnboardingFooterLink,
} from '../../../components/onboarding';

export const RestoreWallet = () => {
  return (
    <Onboarding>
      <OnboardingTitle>Restore your wallet</OnboardingTitle>
      <OnboardingText>
        Restore your wallet by connecting your Ledger hardware wallet or a by entering your Secret
        Key
      </OnboardingText>
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
      <OnboardingFooter>
        <OnboardingFooterLink>I have a Trezor wallet</OnboardingFooterLink>
      </OnboardingFooter>
    </Onboarding>
  );
};
