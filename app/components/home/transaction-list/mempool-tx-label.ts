import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';
import { isStackingTx, isDelegateStxTx, isRevokingDelegationTx } from '@utils/tx-utils';

export function getMempoolTxLabel(tx: MempoolTransaction, address: string, contractId: string) {
  const isSender = tx.sender_address === address;
  if (isStackingTx(tx, contractId) && isSender) {
    return 'Stacking initiating';
  }
  if (isDelegateStxTx(tx, contractId) && isSender) {
    return 'Delegating STX';
  }
  if (isRevokingDelegationTx(tx, contractId) && isSender) {
    return 'Revoking delegated STX';
  }
  return isSender ? 'Sending' : 'Receiving';
}
