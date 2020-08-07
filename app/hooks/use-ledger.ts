import { useRef, useEffect, useCallback, useState } from 'react';
import type Transport from '@ledgerhq/hw-transport';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { useInterval } from './use-interval';
import BlockstackApp from '@zondax/ledger-blockstack';

export enum LedgerConnectStep {
  Disconnected,
  ConnectedAppClosed,
  ConnectedAppOpen,
  HasAddress,
}

export function useLedger() {
  const [step, setStep] = useState(LedgerConnectStep.Disconnected);

  const transport = useRef<Transport | null>(null);
  const disconnectTimeouts = useRef<number>(0);
  const listeningForAddEvent = useRef(true);

  const SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME = 1000;
  const POLL_LEDGER_INTERVAL = 250;

  const createListener = useCallback(() => {
    const tHid = TransportNodeHid.listen({
      next: async (event: any) => {
        if (event.type === 'add') {
          clearTimeout(disconnectTimeouts.current);
          tHid.unsubscribe();
          const t = await TransportNodeHid.open(event.descriptor);
          listeningForAddEvent.current = false;
          transport.current = t;
          t.on('disconnect', async () => {
            listeningForAddEvent.current = true;
            transport.current = null;
            await t.close();
            const timer = setTimeout(() => {
              setStep(LedgerConnectStep.Disconnected);
            }, SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME);
            disconnectTimeouts.current = timer;
            createListener();
          });
        }
      },
      error: () => ({}),
      complete: () => ({}),
    });
    return tHid;
  }, []);

  useEffect(() => {
    const subscription = createListener();
    return () => {
      subscription.unsubscribe();
      if (transport.current) {
        void transport.current.close();
        transport.current = null;
      }
    };
  }, [createListener]);

  useInterval(() => {
    if (
      transport.current &&
      step !== LedgerConnectStep.HasAddress &&
      !listeningForAddEvent.current
    ) {
      // There's a bug with the node-hid library where it doesn't
      // fire disconnect event until next time an operation using it is called.
      // Here we poll a request to ensure the event is fired
      void new BlockstackApp(transport.current)
        .getVersion()
        .then(resp => {
          // TODO: Refactor Ledger app to use enum rather than direct values
          if (resp.returnCode === 0x6e00) return setStep(LedgerConnectStep.ConnectedAppClosed);
          if (resp.returnCode === 0x9000) return setStep(LedgerConnectStep.ConnectedAppOpen);
        })
        .catch(() => ({}));
    }
  }, POLL_LEDGER_INTERVAL);

  return { transport: transport.current, step };
}
