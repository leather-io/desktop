import React, { FC } from 'react';
import { Box, Input, Text, Button } from '@blockstack/ui';
import { ErrorLabel } from '../../components/error-label';
import { ErrorText } from '../../components/error-text';

interface DecryptWalletFormProps {
  hasSubmitted: boolean;
  decryptionError: string | null;
  onForgottenPassword(): void;
  onSetPassword(password: string): void;
}

type Props = FC<DecryptWalletFormProps>;

export const DecryptWalletForm: Props = args => {
  const { onSetPassword, decryptionError, hasSubmitted, onForgottenPassword } = args;

  const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pass = e.currentTarget.value;
    onSetPassword(pass);
  };
  return (
    <Box mx="extra-loose" mt="extra-loose">
      <Text textStyle="body.large">Enter your password to confirm your transaction</Text>
      <Input onChange={handlePasswordInput} mt="base-loose" />
      {hasSubmitted && decryptionError && (
        <ErrorLabel>
          <ErrorText>Password entered is incorrect</ErrorText>
        </ErrorLabel>
      )}
      <Text textStyle="body.small" mt="base-tight" mb="base-loose" display="block">
        Forgot password?{' '}
        <Button variant="link" onClick={onForgottenPassword}>
          Reset your wallet
        </Button>{' '}
        to set a new password.
      </Text>
    </Box>
  );
};
