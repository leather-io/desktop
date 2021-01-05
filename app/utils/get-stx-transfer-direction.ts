import { Transaction, MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import { c32addressDecode } from 'c32check';

export type StxTxDirection = 'sent' | 'received';

export function getStxTxDirection(
  address: string,
  tx: Transaction | MempoolTransaction
): StxTxDirection {
  if (tx.sender_address === address) return 'sent';
  return 'received';
}

// TODO: remove when in tx lib
export const validateStacksAddress = (stacksAddress: string): boolean => {
  try {
    c32addressDecode(stacksAddress);
    return true;
  } catch (e) {
    return false;
  }
};
