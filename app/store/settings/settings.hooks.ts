import { useSelector } from 'react-redux';

import { selectHasUserGivenDiagnosticPermission } from './settings.reducer';

export function useHasUserGivenDiagnosticPermissions() {
  return useSelector(selectHasUserGivenDiagnosticPermission);
}
