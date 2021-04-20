import React, { forwardRef } from 'react';
import { Box, color, Input, Text } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { HomeSelectors } from 'app/tests/features/home.selectors';

interface DecryptWalletFormProps {
  hasSubmitted: boolean;
  decryptionError: string | null;
  description: string;
  onForgottenPassword(): void;
  onSetPassword(password: string): void;
}

export const DecryptWalletForm = forwardRef((props: DecryptWalletFormProps, ref) => {
  const { description, onSetPassword, decryptionError, hasSubmitted, onForgottenPassword } = props;

  const handlePasswordInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pass = e.currentTarget.value;
    onSetPassword(pass);
  };

  return (
    <Box mx="extra-loose" mt="extra-loose">
      <Text textStyle="body.large">{description}</Text>
      <Input
        onChange={handlePasswordInput}
        type="password"
        mt="base-loose"
        data-test={HomeSelectors.InputDecryptWallet}
        ref={ref as any}
      />
      {hasSubmitted && decryptionError && (
        <ErrorLabel>
          <ErrorText>{decryptionError}</ErrorText>
        </ErrorLabel>
      )}
      <Text textStyle="body.small" mt="base-tight" mb="base-loose" display="block">
        Forgot password?{' '}
        <Text
          as="button"
          color={color('brand')}
          fontWeight={500}
          onClick={onForgottenPassword}
          _focus={{ textDecoration: 'underline', outline: 0 }}
        >
          Reset your wallet
        </Text>{' '}
        to set a new password.
      </Text>
    </Box>
  );
});
