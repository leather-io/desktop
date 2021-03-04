import { useEffect } from 'react';

export function useListenLedgerEffect() {
  useEffect(() => {
    api.ledger.createListener();
    return () => api.ledger.removeListener();
  }, []);
}
