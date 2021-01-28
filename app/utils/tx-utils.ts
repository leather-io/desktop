import {
  Transaction,
  MempoolTransaction,
  ContractCallTransaction,
} from '@blockstack/stacks-blockchain-api-types';

export function hasMemo(tx: Transaction): boolean {
  if (tx.tx_type !== 'token_transfer') return false;
  return !!tx.token_transfer.memo;
}

export function getRecipientAddress(tx: Transaction) {
  if (tx.tx_type !== 'token_transfer') return null;
  return tx.token_transfer.recipient_address;
}

export function isContractCall(
  tx: Transaction | MempoolTransaction
): tx is ContractCallTransaction {
  return tx.tx_type === 'contract_call';
}

export function isStackingTx(tx: Transaction | MempoolTransaction, poxContractId?: string) {
  return (
    isContractCall(tx) &&
    tx.contract_call.contract_id === poxContractId &&
    tx.contract_call.function_name === 'stack-stx'
  );
}

export function isDelegatedStackingTx(
  tx: Transaction | MempoolTransaction,
  poxContractId?: string
) {
  return (
    isContractCall(tx) &&
    tx.contract_call.contract_id === poxContractId &&
    tx.contract_call.function_name === 'delegate-stack-stx'
  );
}

export function isDelegateStxTx(tx: Transaction | MempoolTransaction, poxContractId?: string) {
  return (
    isContractCall(tx) &&
    tx.contract_call.contract_id === poxContractId &&
    tx.contract_call.function_name === 'delegate-stx'
  );
}

export function isRevokingDelegationTx(
  tx: Transaction | MempoolTransaction,
  poxContractId?: string
) {
  return (
    isContractCall(tx) &&
    tx.contract_call.contract_id === poxContractId &&
    tx.contract_call.function_name === 'revoke-delegate-stx'
  );
}

export function isMempoolTx(tx: Transaction | MempoolTransaction): tx is MempoolTransaction {
  return tx.tx_status === 'pending';
}

export function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`;
}

/**
 * truncateMiddle
 *
 * @param {string} input - the string to truncate
 * @param {number} offset - the number of chars to keep on either end
 */
export const truncateMiddle = (input: string, offset = 5): string => {
  if (!input) return '';
  // hashes
  if (input.startsWith('0x')) {
    return shortenHex(input, offset);
  }
  // for contracts
  if (input.includes('.')) {
    const parts = input.split('.');
    const start = parts[0]?.substr(0, offset);
    const end = parts[0]?.substr(parts[0].length - offset, parts[0].length);
    return `${start}…${end}.${parts[1]}`;
  } else {
    // everything else
    const start = input?.substr(0, offset);
    const end = input?.substr(input.length - offset, input.length);
    return `${start}…${end}`;
  }
};
