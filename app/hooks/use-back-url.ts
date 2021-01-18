import { useEffect, useContext, useCallback } from 'react';
import { BackContext, BackContextType } from '../pages/root';
import { useHistory } from 'react-router';

export function useBackButtonState(): BackContextType {
  return useContext(BackContext);
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
  }, [setBackUrl, urlToGoBackTo]);
}
