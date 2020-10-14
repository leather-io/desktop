import { Transaction } from '@blockstack/stacks-blockchain-api-types';
import { c32addressDecode } from 'c32check';
import { isLockTx } from './tx-utils';

export type StxTxDirection = 'sent' | 'received' | 'locked';

export function getStxTxDirection(
  address: string,
  tx: Transaction,
  poxContractID?: string
): StxTxDirection {
  if (isLockTx(tx, poxContractID)) return 'locked';
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
