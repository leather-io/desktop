import routes from '../constants/routes.json';
import { useHasUserGivenDiagnosticPermissions } from '@store/settings';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

export function usePromptUserToSetDiagnosticPermissions() {
  const history = useHistory();
  const hasGivenPermission = useHasUserGivenDiagnosticPermissions();

  useEffect(() => {
    if (CONFIG.NODE_ENV === 'test') return;
    if (hasGivenPermission === undefined) history.push(routes.HOME_REQUEST_DIAGNOSTICS);
    // Only want to run on mount, not every time this value changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);
}
