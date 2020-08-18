import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import log from 'electron-log';
import { useClipboard } from '@blockstack/ui';

import routes from '../../../constants/routes.json';
import { Card } from '../../../components/card';
import { Toast } from '../../../components/toast';

import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '../../../components/onboarding';
import { selectMnemonic } from '../../../store/keys/keys.reducer';
import { useBackButton } from '../../../hooks/use-back-url.hook';

const COPY_TOAST_TIMEOUT = 2_500;

export const SecretKey: React.FC = () => {
  const history = useHistory();
  useBackButton(routes.CREATE);
  const [copied, setCopiedState] = useState(false);
  const mnemonic = useSelector(selectMnemonic);

  if (!mnemonic) {
    const err = 'Component `SecretKey` should not render without pre-generated mnemonic';
    log.error(err);
    throw new Error(err);
  }

  const { onCopy } = useClipboard(mnemonic);
  const copyToClipboard = () => {
    onCopy?.();
    setCopiedState(true);
    setTimeout(() => history.push(routes.SAVE_KEY), COPY_TOAST_TIMEOUT);
  };

  return (
    <Onboarding>
      <OnboardingTitle>Your Secret Key</OnboardingTitle>
      <OnboardingText>
        Here’s your Secret Key: 24 words that prove it’s you when you want to access your wallet.
        Once lost, it’s lost forever, so save it somewhere you won’t forget.
      </OnboardingText>
      <Card title="Your Secret Key" mt="extra-loose">
        {mnemonic}
      </Card>
      <OnboardingButton mt="loose" onClick={() => copyToClipboard()}>
        Copy Secret Key
      </OnboardingButton>
      <Toast show={copied}>Copied to clipboard</Toast>
    </Onboarding>
  );
};
