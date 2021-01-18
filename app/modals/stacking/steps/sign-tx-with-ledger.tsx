import React, { FC } from 'react';

import { Box } from '@blockstack/ui';
import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';

import { LedgerConnectStep } from '@hooks/use-prepare-ledger';

interface SignTxWithLedgerProps {
  step: LedgerConnectStep;
}

export const SignTxWithLedger: FC<SignTxWithLedgerProps> = ({ step }) => {
  return (
    <Box mx="extra-loose" mb="extra-loose">
      <LedgerConnectInstructions action="Sign transaction on Ledger" step={step} />
    </Box>
  );
};
