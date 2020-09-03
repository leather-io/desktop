import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Input } from '@blockstack/ui';

import routes from '@constants/routes.json';
import { selectMnemonic } from '@store/keys';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { useBackButton } from '@hooks/use-back-url.hook';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingText,
  OnboardingButton,
  OnboardingFooter,
  OnboardingFooterLink,
} from '@components/onboarding';

export const VerifyKey: React.FC = () => {
  const history = useHistory();
  useBackButton(routes.SECRET_KEY);
  const mnemonic = useSelector(selectMnemonic);
  const [inputMnemonic, setInputMnemonic] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const mnemonicCorrect = mnemonic === inputMnemonic;

  // https://github.com/blockstack/ux/issues/421
  // See should really be a HTMLTextareaElement
  const handleMnemonicInput = (e: React.FormEvent<HTMLInputElement>) => {
    setInputMnemonic(e.currentTarget.value.trim());
  };

  const handleMnemonicValidation = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!mnemonicCorrect) return;
    history.push(routes.SET_PASSWORD);
  };

  return (
    <Onboarding as="form" onSubmit={handleMnemonicValidation}>
      <OnboardingTitle>Verify Secret Key</OnboardingTitle>
      <OnboardingText>Enter your Secret Key to confirm you’ve saved it</OnboardingText>
      <Input
        as="textarea"
        onChange={handleMnemonicInput}
        mt="extra-loose"
        height="88px"
        placeholder="24-word Secret Key"
        style={{ resize: 'none' }}
      />
      {!mnemonicCorrect && hasSubmitted && (
        <ErrorLabel>
          <ErrorText>The Secret Key you've entered doesn't match</ErrorText>
        </ErrorLabel>
      )}
      <OnboardingButton mt="loose" type="submit">
        Continue
      </OnboardingButton>
      <OnboardingFooter>
        <Link to={routes.SECRET_KEY}>
          <OnboardingFooterLink>View Secret Key again</OnboardingFooterLink>
        </Link>
      </OnboardingFooter>
    </Onboarding>
  );
};
