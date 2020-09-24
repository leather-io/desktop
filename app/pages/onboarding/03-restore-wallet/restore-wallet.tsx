import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { validateMnemonic } from 'bip39';
import { Text, Input } from '@blockstack/ui';

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
  OnboardingFooterLink,
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

  const handleSecretKeyRestore = (e: React.FormEvent) => {
    e.preventDefault();

    const mnemonicLength = mnemonic.trim().split(' ').length;
    if (mnemonicLength === 12) {
      setError(
        'You’ve entered a 12-word Secret Key. Please enter the 24-word Secret Key you received when creating this wallet.'
      );
      return;
    }
    if (mnemonicLength !== 24) {
      setError('The Stacks Wallet can only be used with 24-word Secret Keys');
      return;
    }

    if (!validateMnemonic(mnemonic)) {
      setError('Not a valid bip39 mnemonic');
      return;
    }
    dispatch(persistMnemonic(mnemonic.trim()));
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
        placeholder="24-word Secret Key"
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
      <OnboardingButton mt="loose" type="submit" mode="secondary">
        Continue with Secret Key
      </OnboardingButton>
      <OnboardingFooter>
        <OnboardingFooterLink>I have a Trezor wallet</OnboardingFooterLink>
      </OnboardingFooter>
    </Onboarding>
  );
};
