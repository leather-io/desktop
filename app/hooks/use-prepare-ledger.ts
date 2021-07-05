import { useEffect, useMemo, useState } from 'react';
import { LedgerError } from '@zondax/ledger-blockstack';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  LATEST_LEDGER_VERSION_MAJOR,
  LATEST_LEDGER_VERSION_MINOR,
  SUPPORTED_LEDGER_VERSIONS_MINOR,
} from '@constants/index';

import type { LedgerMessageEvents } from '../main/register-ledger-listeners';
import { useListenLedgerEffect } from './use-listen-ledger-effect';
import { messages$ } from './use-message-events';
import { isTestnet } from '@utils/network-utils';

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

  const versionSupportsTestnetLedger = useMemo(() => {
    if (appVersion === null) return false;
    return appVersion.major >= 0 && appVersion.minor > 11;
  }, [appVersion]);

  const isSupportedAppVersion = useMemo(() => {
    if (appVersion === null) return true;
    if (!versionSupportsTestnetLedger && isTestnet()) return false;
    return SUPPORTED_LEDGER_VERSIONS_MINOR.includes(appVersion.minor);
  }, [appVersion, versionSupportsTestnetLedger]);

  const appVersionErrorText = useMemo(() => {
    if (!versionSupportsTestnetLedger && isTestnet()) {
      return `Cannot use Ledger on testnet with app version 0.11.0 or lower. Upgrade on Ledger Live.`;
    }
    return `
      Make sure to upgrade your Stacks app to the latest version in Ledger Live.
      This version of the Stacks Wallet only works with ${String(
        LATEST_LEDGER_VERSION_MAJOR
      )}.${String(LATEST_LEDGER_VERSION_MINOR)}.
      Detected version ${String(appVersion?.major)}.${String(appVersion?.minor)}
    `;
  }, [appVersion, versionSupportsTestnetLedger]);

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
