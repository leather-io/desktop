import { useContext, useEffect } from 'react';
import { BackContext, BackContextType } from '../pages/root';

export function useBackButtonState(): BackContextType {
  return useContext(BackContext);
}

export function useBackButton(urlToGoBackTo?: string) {
  const { setBackUrl } = useBackButtonState();

  useEffect(() => {
    setBackUrl(urlToGoBackTo);
    return () => setBackUrl(undefined);
  }, [setBackUrl, urlToGoBackTo]);
}
