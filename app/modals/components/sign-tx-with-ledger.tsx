import React, { FC, useEffect } from 'react';
import { LedgerConnectInstructions } from '@components/ledger/ledger-connect-instructions';
import { Box } from '@blockstack/ui';
import { useLedger, LedgerConnectStep } from '@hooks/use-ledger';
import BlockstackApp from '@zondax/ledger-blockstack';
import { delay } from '@utils/delay';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';

interface SignTxWithLedgerProps {
  onLedgerConnect(app: BlockstackApp): void;
  updateStep(step: LedgerConnectStep): void;
  ledgerError: null | string;
}

export const SignTxWithLedger: FC<SignTxWithLedgerProps> = props => {
  const { onLedgerConnect, updateStep, ledgerError } = props;
  const { transport, step } = useLedger();

  useEffect(() => {
    updateStep(step);

    async function run() {
      const usbTransport = transport;

      if (usbTransport === null) return;

      const app = new BlockstackApp(usbTransport);

      try {
        await app.getVersion();
        await delay(1);
        onLedgerConnect(app);
      } catch (e) {
        console.log(e);
      }
    }
    void run();
  }, [transport, step, onLedgerConnect, updateStep]);

  return (
    <Box mx="extra-loose" mb="extra-loose">
      <LedgerConnectInstructions action="Sign transaction on Ledger" step={step} />
      {ledgerError && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{ledgerError}</ErrorText>
        </ErrorLabel>
      )}
    </Box>
  );
};
