import { ipcMain } from 'electron';
import * as Sentry from '@sentry/electron';
import ElectronStore from 'electron-store';

let diagnosticsEnabled = true;

export const initializeSentry = (store: ElectronStore) => {
  const state = JSON.parse(store.get('persist:root') as string) || {};
  const settings = JSON.parse(state.settings) || {};
  if (process.env.SENTRY_DSN && settings.diagnosticPermission) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      beforeSend(event) {
        if (!diagnosticsEnabled) return null;
        return event;
      },
    });
  }
};

Sentry.setContext('network', { network: process.env.STX_NETWORK });

export function registerSentryStateListener() {
  ipcMain.on('set-diagnostics-permission', (_event, updatedDiagnosticPermission: boolean) => {
    diagnosticsEnabled = updatedDiagnosticPermission;
  });
}
