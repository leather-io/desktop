import { ipcMain } from 'electron';
import * as Sentry from '@sentry/electron/dist/main';

let diagnosticsEnabled = false;

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    beforeSend(event) {
      if (!diagnosticsEnabled) return null;
      return event;
    },
  });
}

Sentry.setContext('network', { network: process.env.STX_NETWORK });

export function registerSentryStateListener() {
  ipcMain.on('set-diagnostics-permission', (_event, updatedDiagnosticPermission: boolean) => {
    diagnosticsEnabled = updatedDiagnosticPermission;
  });
}
