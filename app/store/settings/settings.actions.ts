import { createAction } from '@reduxjs/toolkit';

export const grantDiagnosticsPermission = createAction('settings/grant-diagnostic-permissions');
export const revokeDiagnosticPermission = createAction('settings/revoke-diagnostic-permissions');
