import { useEffect } from 'react';

export function useListenLedger() {
  useEffect(() => {
    api.ledger.createListener();
    return () => api.ledger.removeListener();
  }, []);
}
