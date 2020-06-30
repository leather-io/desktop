import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

type StxTxDirection = 'sent' | 'received';

export function getStxTxDirection(address: string, tx: Transaction): StxTxDirection {
  if (tx.sender_address === address) return 'sent';
  return 'received';
}
