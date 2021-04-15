import React, { FC } from 'react';

import { Box } from '@stacks/ui';
import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';

import { LedgerConnectStep } from '@hooks/use-prepare-ledger';

interface SignTxWithLedgerProps {
  step: LedgerConnectStep;
  isLocked: boolean;
}

export const SignTxWithLedger: FC<SignTxWithLedgerProps> = ({ step, isLocked }) => {
  return (
    <Box mx="extra-loose" mb="extra-loose">
      <LedgerConnectInstructions
        action="Sign transaction on Ledger"
        step={step}
        isLocked={isLocked}
      />
    </Box>
  );
};
