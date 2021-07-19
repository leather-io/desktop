import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { validateMnemonic } from 'bip39';
import { Text, Input, Flex, Box, color } from '@stacks/ui';

import routes from '@constants/routes.json';
import { Hr } from '@components/hr';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { persistMnemonic } from '@store/keys/keys.actions';
import { useBackButton } from '@hooks/use-back-url';

import {
  Onboarding,
  OnboardingTitle,
  OnboardingButton,
  OnboardingText,
} from '@components/onboarding';
import { ExternalLink } from '@components/external-link';
import { parseSeedPhraseInput } from '@utils/parse-seed-phrase';
import { OnboardingSelector } from 'app/tests/features/onboarding.selectors';

export const RestoreWallet: React.FC = () => {
  useBackButton(routes.WELCOME);

  const [mnemonic, setMnemonic] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleMnemonicInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (hasSubmitted) setHasSubmitted(false);
    if (error) setError(null);
    setMnemonic(e.currentTarget.value.trim());
  };

  const handleSecretKeyRestore = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const parsedMnemonic = parseSeedPhraseInput(mnemonic);

    if (parsedMnemonic === null) {
      setError('Unable to parse Secret Key input');
      return;
    }

    const mnemonicLength = parsedMnemonic.split(' ').length;

    if (mnemonicLength !== 12 && mnemonicLength !== 24) {
      setError('The Hiro Wallet can be used with only 12 and 24-word Secret Keys');
      return;
    }

    if (!validateMnemonic(parsedMnemonic)) {
      setError('bip39error');
      return;
    }

    dispatch(persistMnemonic(parsedMnemonic));
    history.push(routes.SET_PASSWORD);
  };

  return (
    <Onboarding as="form" onSubmit={handleSecretKeyRestore}>
      <OnboardingTitle>Sign in to your wallet</OnboardingTitle>

      <OnboardingText>Connect your Ledger hardware wallet or enter your Secret Key</OnboardingText>
      <OnboardingButton mt="extra-loose" onClick={() => history.push(routes.CONNECT_LEDGER)}>
        Continue with Ledger
      </OnboardingButton>
      <Hr mt="extra-loose" />

      <Box>
        <Flex flexDirection="row" alignItems="baseline">
          <Text textStyle="body.small.medium" mt="extra-loose" display="block">
            Secret Key
          </Text>
          <ExternalLink
            color={color('brand')}
            href="https://www.hiro.so/questions/what-are-secret-keys-and-how-do-they-work"
            fontSize="12px"
            ml="tight"
          >
            Learn more
          </ExternalLink>
        </Flex>

        <Text textStyle="caption" color={color('text-caption')}>
          Your Secret Key is a series of random words also known as a seed phrase.
        </Text>
      </Box>
      <Input
        onChange={handleMnemonicInput}
        as="textarea"
        mt="base-tight"
        minHeight="110px"
        placeholder="apple bounce ladder..."
        style={{
          resize: 'none',
          border: error ? `2px solid ${color('feedback-error')}` : '',
        }}
        data-test={OnboardingSelector.InputSecretKey}
      />
      {error && error !== 'bip39error' && (
        <ErrorLabel>
          <ErrorText>{error}</ErrorText>
        </ErrorLabel>
      )}
      {error && error === 'bip39error' && (
        <ErrorLabel>
          <ErrorText>
            Your Secret Key is not BIP-39 compliant.{' '}
            <ExternalLink
              display="inline-block"
              href="https://www.hiro.so/questions/what-are-secret-keys-and-how-do-they-work#Secret%20Keys%20must%20be%20BIP39%20compatible"
            >
              Learn more
            </ExternalLink>
          </ErrorText>
        </ErrorLabel>
      )}
      <OnboardingButton
        mt="loose"
        type="submit"
        mode="secondary"
        data-test={OnboardingSelector.BtnContinueWithKey}
      >
        Continue with Secret Key
      </OnboardingButton>
    </Onboarding>
  );
};
