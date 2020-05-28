import { useClipboard } from '@blockstack/ui';
import { useHistory } from 'react-router-dom';
import React, { useState } from 'react';

import routes from '../../../constants/routes.json';
import { Card } from '../../../components/card';
import { Toast } from '../../../components/toast';
import { SeedTextarea } from '../../../components/seed-textarea';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '../../../components/onboarding';

const COPY_TOAST_TIMEOUT = 3_000;

export const SecretKey: React.FC = () => {
  const history = useHistory();
  const [copied, setCopiedState] = useState(false);
  const phrase =
    'future act silly correct hold endorse essay save prefer filter donate clap future act silly correct hold endorse essay save prefer filter donate clap';
  const { onCopy } = useClipboard(phrase);
  const copyToClipboard = () => {
    onCopy && onCopy();
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
        <SeedTextarea
          readOnly
          spellCheck="false"
          autoCapitalize="false"
          value={phrase}
          className="hidden-secret-key"
          data-test="textarea-seed-phrase"
        />
      </Card>
      <OnboardingButton mt="loose" onClick={() => copyToClipboard()}>
        Copy Secret Key
      </OnboardingButton>
      <Toast show={copied}>Copied to clipboard</Toast>
    </Onboarding>
  );
};
