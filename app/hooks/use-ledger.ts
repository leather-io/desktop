import { useRef, useEffect, useCallback, useState } from 'react';
import BlockstackApp, { LedgerError } from '@zondax/ledger-blockstack';
import type Transport from '@ledgerhq/hw-transport';
import { safeAwait } from '@utils/safe-await';
import { useInterval } from '@hooks/use-interval';

export enum LedgerConnectStep {
  Disconnected,
  ConnectedAppClosed,
  ConnectedAppOpen,
  HasAddress,
}

const SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME = 1000;
const POLL_LEDGER_INTERVAL = 250;

export function useLedger() {
  const [step, setStep] = useState(LedgerConnectStep.Disconnected);
  const [usbError, setUsbError] = useState<string | null>(null);
  const transport = useRef<Transport | null>(null);
  const disconnectTimeouts = useRef<number>(0);
  const listeningForAddEvent = useRef(true);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const closeTransport = useRef(() => {});
  const createListener = useCallback(() => {
    const tHid = api.nodeHid.listen({
      next: async (event: any) => {
        if (event.type === 'add') {
          clearTimeout(disconnectTimeouts.current);
          tHid.unsubscribe();
          const [error, resp] = await safeAwait(
            api.nodeHid.open({
              descriptor: event.descriptor,
              onDisconnect: () => {
                listeningForAddEvent.current = true;
                transport.current = null;
                const timer = setTimeout(() => {
                  setStep(LedgerConnectStep.Disconnected);
                }, SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME);
                disconnectTimeouts.current = (timer as unknown) as number;
                createListener();
              },
            })
          );
          if (error) {
            setUsbError('Unable to connect to device. You may need to configure your udev rules.');
            return;
          }
          if (resp) {
            closeTransport.current = resp.closeTransportConnection;
            setUsbError(null);
            listeningForAddEvent.current = false;
            transport.current = resp.transport;
          }
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
      if (closeTransport.current) {
        void closeTransport.current();
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
          if (resp.returnCode === LedgerError.AppDoesNotSeemToBeOpen)
            return setStep(LedgerConnectStep.ConnectedAppClosed);
          if (resp.returnCode === LedgerError.NoErrors)
            return setStep(LedgerConnectStep.ConnectedAppOpen);
        })
        .catch(() => ({}));
    }
  }, POLL_LEDGER_INTERVAL);
  return {
    transport: transport.current,
    step,
    error: usbError,
  };
}
