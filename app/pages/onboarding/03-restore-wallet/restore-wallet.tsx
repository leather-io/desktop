import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { validateMnemonic } from 'bip39';
import { Text, Input, Flex, Box, ExclamationMarkCircleIcon } from '@blockstack/ui';

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
  OnboardingFooter,
} from '@components/onboarding';

export const RestoreWallet: React.FC = () => {
  useBackButton(routes.WELCOME);

  const [mnemonic, setMnemonic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleMnemonicInput = (e: React.FormEvent<HTMLInputElement>) => {
    setMnemonic(e.currentTarget.value.trim());
  };

  const mnemonicLength = mnemonic.trim().split(' ').length;

  const handleSecretKeyRestore = (e: React.FormEvent) => {
    e.preventDefault();

    if (mnemonicLength !== 12 && mnemonicLength !== 24) {
      setError('The Stacks Wallet can be used with only 12 and 24-word Secret Keys');
      return;
    }

    const parsedMnemonic = mnemonic.toLowerCase().trim();

    if (!validateMnemonic(parsedMnemonic)) {
      setError('Not a valid bip39 mnemonic');
      return;
    }
    dispatch(persistMnemonic(parsedMnemonic));
    history.push(routes.SET_PASSWORD);
  };

  return (
    <Onboarding as="form" onSubmit={handleSecretKeyRestore}>
      <OnboardingTitle>Sign in to your wallet</OnboardingTitle>
      <OnboardingText>
        Sign in to your wallet by connecting your Ledger hardware wallet or a by entering your
        Secret Key
      </OnboardingText>
      <OnboardingButton mt="extra-loose" onClick={() => history.push(routes.CONNECT_LEDGER)}>
        Continue with Ledger
      </OnboardingButton>

      <Hr my="extra-loose" />

      <Text textStyle="body.small.medium">Secret Key</Text>
      <Input
        onChange={handleMnemonicInput}
        as="textarea"
        mt="base-tight"
        minHeight="90px"
        placeholder="Secret Key"
        style={{
          resize: 'none',
          border: error ? '2px solid #D4001A' : '',
        }}
      />
      {error && (
        <ErrorLabel>
          <ErrorText>{error}</ErrorText>
        </ErrorLabel>
      )}
      {mnemonicLength === 12 && (
        <Flex
          mt="base-loose"
          px="base"
          py="base-tight"
          backgroundColor="#FFEDD6"
          borderRadius="4px"
        >
          <Box mr="tight" mt="1px">
            <ExclamationMarkCircleIcon size="14px" color="#FE9000" />
          </Box>
          <Text textStyle="caption" color="#424248" lineHeight="16px">
            It appears you've entered a Secret Key originally created elsewhere than the Stacks
            Wallet. We recommend you create a new Secret Key with the Stacks Wallet for greater
            security.
          </Text>
        </Flex>
      )}
      <OnboardingButton mt="loose" type="submit" mode="secondary">
        Continue with Secret Key
      </OnboardingButton>
      <OnboardingFooter>
        {/* <OnboardingFooterLink>I have a Trezor wallet</OnboardingFooterLink> */}
      </OnboardingFooter>
    </Onboarding>
  );
};
