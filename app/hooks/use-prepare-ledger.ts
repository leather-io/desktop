import { useEffect, useMemo, useState } from 'react';
import { LedgerError } from '@zondax/ledger-blockstack';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SUPPORTED_LEDGER_VERSION_MAJOR, SUPPORTED_LEDGER_VERSION_MINOR } from '@constants/index';

import type { LedgerMessageEvents } from '../main/register-ledger-listeners';
import { useListenLedgerEffect } from './use-listen-ledger-effect';
import { messages$ } from './use-message-events';

export enum LedgerConnectStep {
  Disconnected,
  ConnectedAppClosed,
  ConnectedAppOpen,
  ActionComplete,
}

interface AppVersion {
  major: number;
  minor: number;
  patch: number;
}

const ledgerEvents$ = messages$.pipe(
  filter(value => value.type === 'ledger-event')
) as Observable<LedgerMessageEvents>;

export function usePrepareLedger() {
  const [step, setStep] = useState<LedgerConnectStep>(LedgerConnectStep.Disconnected);
  const [isLocked, setIsLocked] = useState(false);
  const [appVersion, setAppVersion] = useState<AppVersion | null>(null);

  const isSupportedAppVersion = useMemo(() => {
    if (appVersion === null) return true;
    return (
      appVersion.major === SUPPORTED_LEDGER_VERSION_MAJOR &&
      appVersion.minor === SUPPORTED_LEDGER_VERSION_MINOR
    );
  }, [appVersion]);

  const appVersionErrorText = useMemo(() => {
    return `
      Make sure to upgrade your Stacks app to the latest version in Ledger Live.
      This version of the Stacks Wallet only works with ${SUPPORTED_LEDGER_VERSION_MAJOR}.${SUPPORTED_LEDGER_VERSION_MINOR}.
      Detected version ${String(appVersion?.major)}.${String(appVersion?.minor)}
    `;
  }, [appVersion]);

  useListenLedgerEffect();

  useEffect(() => {
    const sub = ledgerEvents$
      .pipe(filter(message => message.type === 'ledger-event'))
      .subscribe(message => {
        if (message.name === 'disconnected') {
          setStep(LedgerConnectStep.Disconnected);
        }
        if ('action' in message && message.action === 'get-version') {
          if (
            Number.isInteger(message.major) &&
            Number.isInteger(message.minor) &&
            Number.isInteger(message.patch)
          ) {
            setAppVersion({
              major: message.major,
              minor: message.minor,
              patch: message.patch,
            });
          }
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

  return { step, isLocked, appVersion, isSupportedAppVersion, appVersionErrorText };
}
