import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Text, Input } from '@blockstack/ui';

import { setSoftwareWallet } from '@store/keys';
import {
  Onboarding,
  OnboardingTitle,
  OnboardingText,
  OnboardingButton,
} from '@components/onboarding';
import {
  validatePassword,
  blankPasswordValidation,
  ValidatedPassword,
} from '../../../crypto/validate-password';

const weakPasswordWarningMessage = (result: ValidatedPassword) => {
  if (result.feedback.suggestions.length > 0) {
    return `${result.feedback.suggestions.join(' ')}`;
  }
  if (!result.meetsScoreRequirement) {
    return 'Your password is vulnerable to brute force attacks. Try using a stronger password at least 12 characters in length';
  }
  if (!result.meetsLengthRequirement) {
    return 'Your password must also be at least 12 characters long.';
  }
  return 'Consider using a password generator to ensure your funds are sufficiently secure';
};

export const SetPassword: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [password, setPassword] = useState<string | null>(null);
  const [strengthResult, setStrengthResult] = useState(blankPasswordValidation);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pass = e.currentTarget.value;
    setPassword(pass);
    const result = validatePassword(pass);
    setStrengthResult(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === null) return;
    setHasSubmitted(true);
    const result = validatePassword(password);
    setStrengthResult(result);
    if (result.meetsAllStrengthRequirements) {
      setBtnDisabled(true);
      dispatch(setSoftwareWallet({ password, history }));
    }
  };

  const strengthText = (result: ValidatedPassword) =>
    result.meetsAllStrengthRequirements ? 'Strong' : 'Not strong enough';

  const strengthColor = (result: ValidatedPassword) =>
    result.meetsAllStrengthRequirements ? 'feedback.success' : 'feedback.error';

  return (
    <Onboarding as="form" onSubmit={handleSubmit}>
      <OnboardingTitle>Set a password</OnboardingTitle>
      <OnboardingText>You’ll use your password to confirm transactions</OnboardingText>
      <Input type="password" mt="extra-loose" onChange={handlePasswordInput} />
      <Text textStyle="body.small" color="ink.600" mt="base">
        Password strength:
        <Text
          textStyle="body.small.medium"
          color={password === null ? undefined : strengthColor(strengthResult)}
          ml="tight"
        >
          {password === null ? '—' : strengthText(strengthResult)}
        </Text>
      </Text>
      {!strengthResult.meetsAllStrengthRequirements && hasSubmitted && (
        <Text textStyle="body.small" color="ink.600" mt="tight">
          {weakPasswordWarningMessage(strengthResult)}
        </Text>
      )}
      <OnboardingButton type="submit" mt="loose" isLoading={btnDisabled} isDisabled={btnDisabled}>
        Continue
      </OnboardingButton>
    </Onboarding>
  );
};
