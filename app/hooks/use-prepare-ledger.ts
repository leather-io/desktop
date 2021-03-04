import { useEffect, useState } from 'react';
import { LedgerError } from '@zondax/ledger-blockstack';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import type { LedgerMessageEvents } from '../main/register-ledger-listeners';
import { useListenLedgerEffect } from './use-listen-ledger-effect';
import { messages$ } from './use-message-events';

export enum LedgerConnectStep {
  Disconnected,
  ConnectedAppClosed,
  ConnectedAppOpen,
  ActionComplete,
}

const ledgerEvents$ = messages$.pipe(
  filter(value => value.type === 'ledger-event')
) as Observable<LedgerMessageEvents>;

export function usePrepareLedger() {
  const [step, setStep] = useState<LedgerConnectStep>(LedgerConnectStep.Disconnected);
  const [isLocked, setIsLocked] = useState(false);

  useListenLedgerEffect();

  useEffect(() => {
    const sub = ledgerEvents$
      .pipe(filter(message => message.type === 'ledger-event'))
      .subscribe(message => {
        if (message.name === 'disconnected') {
          setStep(LedgerConnectStep.Disconnected);
        }
        if ('action' in message && message.action === 'get-version') {
          setIsLocked(message.deviceLocked);
          if (message.returnCode === LedgerError.AppDoesNotSeemToBeOpen) {
            setStep(LedgerConnectStep.ConnectedAppClosed);
          }
          if (message.returnCode === LedgerError.NoErrors) {
            setStep(LedgerConnectStep.ConnectedAppOpen);
          }
        }
      });
    return () => sub.unsubscribe();
  }, []);

  return { step, isLocked };
}
