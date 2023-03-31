import { BackActionContext, BackContext } from '../pages/root';
import { useEffect, useContext, useCallback } from 'react';
import { useHistory } from 'react-router';

export function useBackButtonState(): BackContext {
  return useContext(BackActionContext);
}

export function useBack(): [any, () => void] {
  const { backUrl } = useBackButtonState();
  const history = useHistory();

  const handleOnBack = useCallback(() => {
    if (backUrl === null) return;
    if (typeof backUrl === 'string') {
      history.push(backUrl);
    }
    if (typeof backUrl === 'function') {
      backUrl();
    }
  }, [backUrl, history]);

  return [backUrl, handleOnBack];
}

export function useBackButton(urlToGoBackTo: string | null | (() => void)) {
  const { setBackUrl } = useBackButtonState();
  useEffect(() => {
    setBackUrl(() => urlToGoBackTo);
    return () => setBackUrl(null);
  }, [setBackUrl, urlToGoBackTo]);
}
