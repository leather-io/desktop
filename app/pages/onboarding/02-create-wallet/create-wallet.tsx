import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { onboardingMnemonicGenerationStep } from '@store/keys';
import routes from '@constants/routes.json';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
  OnboardingFooter,
  OnboardingFooterLink,
} from '@components/onboarding';
import { useBackButton } from '@hooks/use-back-url';
import { openExternalLink } from '@utils/external-links';
import { TREZOR_HELP_URL } from '@constants/index';
import { isMainnet } from '@utils/network-utils';

export const CreateWallet: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  useBackButton(routes.WELCOME);

  const createSoftwareWallet = () => {
    dispatch(onboardingMnemonicGenerationStep({ stepDelayMs: 1_250 }));
    history.push(routes.GENERATING);
  };

  const openTrezorHelpPage = () => openExternalLink(TREZOR_HELP_URL);

  return (
    <Onboarding>
      <OnboardingTitle>Create a new wallet</OnboardingTitle>
      <OnboardingText>
        Please choose whether you’d like to connect a Ledger hardware wallet or to create a software
        wallet
      </OnboardingText>
      {isMainnet() && (
        <OnboardingButton mt="extra-loose" onClick={() => history.push(routes.CONNECT_LEDGER)}>
          Use a Ledger wallet
        </OnboardingButton>
      )}

      <OnboardingButton onClick={createSoftwareWallet} mode="secondary">
        Create a software wallet
      </OnboardingButton>

      <OnboardingFooter>
        <OnboardingFooterLink onClick={openTrezorHelpPage}>
          I have a Trezor wallet
        </OnboardingFooterLink>
      </OnboardingFooter>
    </Onboarding>
  );
};
