import { useRef, useEffect, useCallback, useState } from 'react';
import BlockstackApp, { LedgerError } from '@zondax/ledger-blockstack';
import type Transport from '@ledgerhq/hw-transport';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';

import { useInterval } from './use-interval';
import { safeAwait } from '@utils/safe-await';

export enum LedgerConnectStep {
  Disconnected,
  ConnectedAppClosed,
  ConnectedAppOpen,
  HasAddress,
}

export function useLedger() {
  // const [step, setStep] = useState(LedgerConnectStep.Disconnected);
  // const [usbError, setUsbError] = useState<string | null>(null);
  // const transport = useRef<Transport | null>(null);
  // const disconnectTimeouts = useRef<number>(0);
  // const listeningForAddEvent = useRef(true);
  // const SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME = 1000;
  // const POLL_LEDGER_INTERVAL = 250;
  // const createListener = useCallback(() => {
  //   const tHid = TransportNodeHid.listen({
  //     next: async event => {
  //       if (event.type === 'add') {
  //         clearTimeout(disconnectTimeouts.current);
  //         tHid.unsubscribe();
  //         const [error, t] = await safeAwait(TransportNodeHid.open(event.descriptor));
  //         if (error) {
  //           console.log(error);
  //           setUsbError('Unable to connect to device. You may need to configure your udev rules.');
  //           return;
  //         }
  //         if (t) {
  //           setUsbError(null);
  //           t.on('disconnect', async () => {
  //             listeningForAddEvent.current = true;
  //             transport.current = null;
  //             await t.close();
  //             const timer = setTimeout(() => {
  //               setStep(LedgerConnectStep.Disconnected);
  //             }, SAFE_ASSUME_REAL_DEVICE_DISCONNECT_TIME);
  //             disconnectTimeouts.current = (timer as unknown) as number;
  //             createListener();
  //           });
  //           listeningForAddEvent.current = false;
  //           transport.current = t;
  //         }
  //       }
  //     },
  //     error: () => ({}),
  //     complete: () => ({}),
  //   });
  //   return tHid;
  // }, []);
  // useEffect(() => {
  //   const subscription = createListener();
  //   return () => {
  //     subscription.unsubscribe();
  //     if (transport.current) {
  //       void transport.current.close();
  //       transport.current = null;
  //     }
  //   };
  // }, [createListener]);
  // useInterval(() => {
  //   if (
  //     transport.current &&
  //     step !== LedgerConnectStep.HasAddress &&
  //     !listeningForAddEvent.current
  //   ) {
  //     // There's a bug with the node-hid library where it doesn't
  //     // fire disconnect event until next time an operation using it is called.
  //     // Here we poll a request to ensure the event is fired
  //     void new BlockstackApp(transport.current)
  //       .getVersion()
  //       .then(resp => {
  //         if (resp.returnCode === LedgerError.AppDoesNotSeemToBeOpen)
  //           return setStep(LedgerConnectStep.ConnectedAppClosed);
  //         if (resp.returnCode === LedgerError.NoErrors)
  //           return setStep(LedgerConnectStep.ConnectedAppOpen);
  //       })
  //       .catch(() => ({}));
  //   }
  // }, POLL_LEDGER_INTERVAL);
  // return {
  //   transport: transport.current,
  //   step,
  //   error: usbError,
  // };
}
