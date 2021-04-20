import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { Text, Input, Flex, color } from '@stacks/ui';
import { setSoftwareWallet } from '@store/keys';
import { useBackButton } from '@hooks/use-back-url';
import { FULL_ENTITY_NAME } from '@constants/index';

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
} from '@crypto/validate-password';
import { ExplainerTooltip } from '@components/tooltip';
import { blastUndoStackToRemovePasswordFromMemory } from '@utils/blast-undo-stack';

const weakPasswordWarningMessage = (result: ValidatedPassword) => {
  if (result.isMnemonicPhrase) {
    return `Don't use your mnemonic Secret Key as your wallet password. This password is used to encrypt your Secret Key.`;
  }
  if (result.feedback.suggestions.length > 0) {
    return `${result.feedback.suggestions.join(' ')}`;
  }
  if (result.feedback.warning) {
    return `${result.feedback.warning}`;
  }
  if (!result.meetsScoreRequirement) {
    return 'This password is vulnerable to brute force attacks. Try adding more non-alphanumeric characters.';
  }
  if (!result.meetsLengthRequirement) {
    return 'Your password must be at least 12 characters long';
  }
  return 'Consider using a password generator to ensure your funds are sufficiently secure.';
};

export const SetPassword: React.FC = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [strengthResult, setStrengthResult] = useState(blankPasswordValidation);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [successfullyChosenStrongPass, setSuccessfullyChosenStrongPass] = useState(false);

  const handleBack = useCallback(() => {
    history.goBack();
  }, [history]);

  useBackButton(btnDisabled ? null : handleBack);

  const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pass = e.currentTarget.value;
    setPassword(pass);
    const result = validatePassword(pass);
    if (result.isMnemonicPhrase) setHasSubmitted(true);
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
      setSuccessfullyChosenStrongPass(true);
      blastUndoStackToRemovePasswordFromMemory(passwordInputRef.current);
      dispatch(setSoftwareWallet({ password, history }));
    }
  };

  const strengthText = (result: ValidatedPassword) =>
    result.meetsAllStrengthRequirements ? 'Strong' : 'Not strong enough';

  const strengthColor = (result: ValidatedPassword) =>
    result.meetsAllStrengthRequirements ? color('feedback-success') : color('feedback-error');

  return (
    <Onboarding as="form" onSubmit={handleSubmit}>
      <OnboardingTitle>Set a password</OnboardingTitle>
      <OnboardingText>
        You’ll use your password when sending transactions. <br />
        If you forget it, you can restore your wallet from your Secret Key.
      </OnboardingText>
      <Flex mt="base-loose">
        <ExplainerTooltip textStyle="caption">
          Your password encrypts your Secret Key on your computer. This way, you can keep your
          Secret Key safe, and only ever have to access it when restoring your wallet.
          <br />
          <br />
          No one from {FULL_ENTITY_NAME} will ever ask for your password or Secret Key.
        </ExplainerTooltip>
        <Text textStyle="caption" color={color('text-caption')} ml="tight">
          Why do I need to set a password?
        </Text>
      </Flex>
      <Input
        type="password"
        mt="base-tight"
        onChange={handlePasswordInput}
        ref={passwordInputRef}
      />
      {!successfullyChosenStrongPass && (
        <Text display="block" textStyle="body.small" color={color('text-caption')} mt="base">
          Password strength:
          <Text
            textStyle="body.small.medium"
            color={password === null ? undefined : strengthColor(strengthResult)}
            ml="tight"
          >
            {password === null ? '—' : strengthText(strengthResult)}
          </Text>
        </Text>
      )}
      {!strengthResult.meetsAllStrengthRequirements &&
        hasSubmitted &&
        !successfullyChosenStrongPass && (
          <Text display="block" textStyle="body.small" color="ink.600" mt="tight">
            {weakPasswordWarningMessage(strengthResult)}
          </Text>
        )}
      <OnboardingButton type="submit" mt="loose" isLoading={btnDisabled} isDisabled={btnDisabled}>
        Continue
      </OnboardingButton>
    </Onboarding>
  );
};
