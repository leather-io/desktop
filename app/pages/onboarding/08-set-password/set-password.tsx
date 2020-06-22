import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Input } from '@blockstack/ui';

import { setPassword as setPasswordAction } from '../../../store/keys';
import { Onboarding, OnboardingTitle, OnboardingButton } from '../../../components/onboarding';
import { ErrorLabel } from '../../../components/error-label';
import { ErrorText } from '../../../components/error-text';
import {
  validatePassword,
  blankPasswordValidation,
  ValidatedPassword,
} from '../../../crypto/validate-password';

const weakPasswordWarningMessage = (result: ValidatedPassword) => {
  if (result.feedback.warning) {
    return `${result.feedback.warning} ${result.feedback.suggestions.join(' ')}`;
  }
  if (!result.meetsScoreRequirement) {
    return 'Your password is too weak, making it vulnerable to brute force attacks. Try using a stronger password at least 12 characters in length';
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === null) return;
    setHasSubmitted(true);
    const result = validatePassword(password);
    setStrengthResult(result);
    if (result.meetsAllStrengthRequirements) {
      setBtnDisabled(true);
      dispatch(setPasswordAction({ password, history }));
    }
  };

  return (
    <Onboarding as="form" onSubmit={handleSubmit}>
      <OnboardingTitle>Set a password</OnboardingTitle>
      <Input type="password" mt="extra-loose" onChange={handlePasswordInput} />
      {!strengthResult.meetsAllStrengthRequirements && hasSubmitted && (
        <ErrorLabel>
          <ErrorText>{weakPasswordWarningMessage(strengthResult)}</ErrorText>
        </ErrorLabel>
      )}
      <OnboardingButton type="submit" mt="loose" isDisabled={btnDisabled}>
        Continue
      </OnboardingButton>
    </Onboarding>
  );
};
