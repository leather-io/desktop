import React from 'react';
import { useHistory } from 'react-router-dom';

import routes from '@constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '@components/onboarding';
import { useBackButton } from '@hooks/use-back-url';
import { WalletWarning } from '@components/wallet-warning';
import { OnboardingSelector } from 'app/tests/features/onboarding.selectors';

export const Welcome: React.FC = () => {
  const history = useHistory();
  useBackButton(routes.TERMS);

  return (
    <Onboarding>
      <OnboardingTitle>Hiro Wallet</OnboardingTitle>
      <OnboardingText>
        Manage your STX holdings, and earn Bitcoin by participating in Stacking
      </OnboardingText>
      <OnboardingButton mt="extra-loose" onClick={() => history.push(routes.CREATE)}>
        Create a new wallet
      </OnboardingButton>
      <OnboardingButton
        onClick={() => history.push(routes.RESTORE)}
        mt="base"
        mode="secondary"
        data-test={OnboardingSelector.BtnRestoreWallet}
      >
        I already have a wallet
      </OnboardingButton>
      <WalletWarning mt="extra-loose" />
    </Onboarding>
  );
};
