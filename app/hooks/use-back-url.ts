import { useEffect, useContext } from 'react';
import { BackContext } from '../pages/root';

export function useBackButton(urlToGoBackTo: string | null | (() => void)) {
  const { backUrl, setBackUrl } = useContext(BackContext);
  useEffect(() => {
    if (!urlToGoBackTo) return;
    setBackUrl(urlToGoBackTo);
    return () => setBackUrl(null);
  }, [setBackUrl, urlToGoBackTo]);
  return backUrl;
}
