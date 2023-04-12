import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';
import { LedgerConnectStep } from '@hooks/use-prepare-ledger';
import { Box } from '@stacks/ui';
import React, { FC } from 'react';

interface SignTxWithLedgerProps {
  step: LedgerConnectStep;
  isLocked: boolean;
  ledgerError: null | string;
}

export const SignTxWithLedger: FC<SignTxWithLedgerProps> = props => {
  const { step, isLocked, ledgerError } = props;

  return (
    <Box mx="extra-loose" mb="extra-loose">
      <LedgerConnectInstructions
        action="Sign transaction on Ledger"
        step={step}
        isLocked={isLocked}
      />
      {ledgerError && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{ledgerError}</ErrorText>
        </ErrorLabel>
      )}
    </Box>
  );
};
