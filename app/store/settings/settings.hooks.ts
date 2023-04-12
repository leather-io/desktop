import { selectHasUserGivenDiagnosticPermission } from './settings.reducer';
import { useSelector } from 'react-redux';

export function useHasUserGivenDiagnosticPermissions() {
  return useSelector(selectHasUserGivenDiagnosticPermission);
}
