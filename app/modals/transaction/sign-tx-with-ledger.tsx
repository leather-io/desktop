import React, { FC, useEffect } from 'react';
import { LedgerConnectInstructions } from '../../components/ledger/ledger-connect-instructions';
import { Box } from '@blockstack/ui';
import { useLedger } from '../../hooks/use-ledger';
import BlockstackApp from '@zondax/ledger-blockstack';
import { delay } from '../../utils/delay';

interface SignTxWithLedgerProps {
  onLedgerConnect(app: BlockstackApp): void;
}

export const SignTxWithLedger: FC<SignTxWithLedgerProps> = ({ onLedgerConnect }) => {
  const { transport, step } = useLedger();

  // async function handleLedger() {
  //   const usbTransport = transport;

  //   if (usbTransport === null) return;

  //   const app = new BlockstackApp(usbTransport);

  //   try {
  //     await app.getVersion();
  //     await delay(1);
  //     onLedgerConnect(app);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  useEffect(() => {
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
  }, [transport, step, onLedgerConnect]);
  return (
    <Box mx="extra-loose" mb="extra-loose">
      <LedgerConnectInstructions step={step} />
    </Box>
  );
};
