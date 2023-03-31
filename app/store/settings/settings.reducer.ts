import { RootState } from '..';
import { grantDiagnosticsPermission, revokeDiagnosticPermission } from './settings.actions';
import { createReducer, createSelector } from '@reduxjs/toolkit';

export interface SettingsState {
  diagnosticPermission: boolean | undefined;
}

const initialState: SettingsState = { diagnosticPermission: undefined };

function setDiagnosticPermissionTo(givenPermission: boolean) {
  return (state: SettingsState) => ({ ...state, diagnosticPermission: givenPermission });
}

export const settingsReducer = createReducer(initialState, builder =>
  builder
    .addCase(grantDiagnosticsPermission, setDiagnosticPermissionTo(true))
    .addCase(revokeDiagnosticPermission, setDiagnosticPermissionTo(false))
);

export const selectSettingsState = (state: RootState) => state.settings;

export const selectHasUserGivenDiagnosticPermission = createSelector(
  selectSettingsState,
  state => state.diagnosticPermission
);
