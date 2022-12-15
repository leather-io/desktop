import React, { FC, useRef } from 'react';
import { useFormik } from 'formik';
import { Input, Text, Button, Flex } from '@stacks/ui';
import { getStxAddress } from '@stacks/wallet-sdk';

import { HomeSelectors } from 'app/tests/features/home.selectors';
import { useDecryptWallet } from '@hooks/use-decrypt-wallet';
import { ExplainerTooltip } from '@components/tooltip';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { delay } from '@utils/delay';
import { blastUndoStackToRemovePasswordFromMemory } from '@utils/blast-undo-stack';
import { TRANSACTION_VERSION } from '@constants/index';

interface RevealStxPasswordFormProps {
  onAddressDerived(address: string): void;
}

export const RevealStxPasswordForm: FC<RevealStxPasswordFormProps> = props => {
  const { onAddressDerived } = props;
  const { decryptWallet } = useDecryptWallet();

  const passwordRef = useRef<HTMLInputElement | null>(null);

  const passwordForm = useFormik({
    initialValues: { password: '' },
    async onSubmit(values, form) {
      await delay(100);

      blastUndoStackToRemovePasswordFromMemory(passwordRef.current);

      try {
        const account = await decryptWallet(values.password);
        const address = getStxAddress({ account, transactionVersion: TRANSACTION_VERSION });
        onAddressDerived(address);
      } catch (e) {
        form.setErrors({ password: 'Unable to decrypt wallet' });
      }
    },
  });

  return (
    <>
      <Text textStyle="body.large.medium" mt="base-loose">
        Unlock your wallet
      </Text>
      <Flex mt="base-tight">
        <ExplainerTooltip textStyle="caption">
          Unlocking your wallet ensures your address has not been modified.
        </ExplainerTooltip>
        <Text textStyle="caption" color="ink.600" ml="extra-tight">
          Enter your password to reveal your STX address
        </Text>
      </Flex>

      <form onSubmit={passwordForm.handleSubmit}>
        <Input
          placeholder="Enter your password"
          name="password"
          type="password"
          mt="base-tight"
          maxWidth="380px"
          ref={passwordRef}
          data-test={HomeSelectors.InputReceiveStxAddressPassword}
          onChange={passwordForm.handleChange}
        />
        {passwordForm.errors.password && (
          <ErrorLabel>
            <ErrorText>{passwordForm.errors.password}</ErrorText>
          </ErrorLabel>
        )}
        <Button
          type="submit"
          mt="base-loose"
          isDisabled={passwordForm.isSubmitting}
          isLoading={passwordForm.isSubmitting}
          data-test={HomeSelectors.BtnRevealStxAddress}
        >
          Reveal STX address
        </Button>
      </form>
    </>
  );
};
