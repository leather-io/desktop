import { Transaction } from '@blockstack/stacks-blockchain-api-types';

export function hasMemo(tx: Transaction): boolean {
  if (tx.tx_type !== 'token_transfer') return false;
  return !!tx.token_transfer.memo;
}

export function getRecipientAddress(tx: Transaction) {
  if (tx.tx_type !== 'token_transfer') return null;
  return tx.token_transfer.recipient_address;
}

export function isLockTx(tx: Transaction): boolean {
  return tx.tx_type === 'contract_call' && tx.contract_call.contract_id.includes('pox');
}
