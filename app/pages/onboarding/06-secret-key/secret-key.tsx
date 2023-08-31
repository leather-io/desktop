import { Card } from '@components/card';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '@components/onboarding';
import { Toast } from '@components/toast';
import routes from '@constants/routes.json';
import { useAnalytics } from '@hooks/use-analytics';
import { useBackButton } from '@hooks/use-back-url';
import { Box, useClipboard, Text, Button, color } from '@stacks/ui';
import { selectMnemonic } from '@store/keys/keys.reducer';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

export const SecretKey: React.FC = () => {
  const history = useHistory();
  useBackButton(routes.CREATE);
  const mnemonic = useSelector(selectMnemonic);
  const [hasSavedMnemonic, setHasSavedMnemonic] = useState(false);

  if (!mnemonic) {
    const err = 'Component `SecretKey` should not render without pre-generated mnemonic';
    throw new Error(err);
  }

  const { onCopy, hasCopied } = useClipboard(mnemonic);
  const analytics = useAnalytics();
  const onCopyTracked = () => {
    void analytics.track('copy_secret_key_to_clipboard');
    onCopy();
  };

  return (
    <Onboarding>
      <OnboardingTitle>Your Secret Key</OnboardingTitle>
      <OnboardingText>
        Here&apos;s your Secret Key: 24 words that give you access Leather. If you lose your Secret
        Key, you&apos;ll be unable to access your STX tokens. No one can reset it for you.
      </OnboardingText>
      <Card title="Your Secret Key" mt="extra-loose">
        <Text textStyle="body.small" mt="loose" mx="loose" lineHeight="20px" display="block">
          {mnemonic}
        </Text>
        <Button variant="link" mt="tight" onClick={onCopyTracked}>
          <Text textStyle="caption.medium" fontSize="12px">
            Copy to clipboard
          </Text>
        </Button>
      </Card>
      <Box display="block" as="label" mt="loose">
        <input type="checkbox" onChange={e => setHasSavedMnemonic(e.currentTarget.checked)} />
        <Text textStyle="body.small" color={color('text-body')} ml="base-tight">
          I have saved my Secret Key
        </Text>
      </Box>
      <OnboardingButton
        mt="loose"
        isDisabled={!hasSavedMnemonic}
        onClick={() => history.push(routes.VERIFY_KEY)}
      >
        Continue
      </OnboardingButton>
      <Toast show={hasCopied}>Copied to clipboard</Toast>
    </Onboarding>
  );
};
