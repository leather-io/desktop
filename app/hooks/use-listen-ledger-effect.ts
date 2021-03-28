import { useEffect } from 'react';

export function useListenLedgerEffect() {
  useEffect(() => {
    main.ledger.createListener();
    return () => main.ledger.removeListener();
  }, []);
}
