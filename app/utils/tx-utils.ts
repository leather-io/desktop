import {
  Transaction,
  MempoolTransaction,
  ContractCallTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { SEND_MANY_CONTACT_ID } from '@constants/index';
import BigNumber from 'bignumber.js';
import { StxTxDirection } from './get-stx-transfer-direction';
import { sumStxTxTotal } from './sum-stx-tx-total';

type AnyTx = Transaction | MempoolTransaction;

export function hasMemo(tx: Transaction): boolean {
  if (tx.tx_type !== 'token_transfer') return false;
  return !!tx.token_transfer.memo;
}

export function getRecipientAddress(tx: Transaction) {
  if (tx.tx_type !== 'token_transfer') return null;
  return tx.token_transfer.recipient_address;
}

export function isContractCall(tx: AnyTx): tx is ContractCallTransaction {
  return tx.tx_type === 'contract_call';
}

export function isStackingTx(tx: AnyTx, poxContractId?: string) {
  return (
    isContractCall(tx) &&
    tx.contract_call.contract_id === poxContractId &&
    tx.contract_call.function_name === 'stack-stx'
  );
}

export function isDelegatedStackingTx(tx: AnyTx, poxContractId?: string) {
  return (
    isContractCall(tx) &&
    tx.contract_call.contract_id === poxContractId &&
    tx.contract_call.function_name === 'delegate-stack-stx'
  );
}

export function isDelegateStxTx(tx: AnyTx, poxContractId?: string) {
  return (
    isContractCall(tx) &&
    tx.contract_call.contract_id === poxContractId &&
    tx.contract_call.function_name === 'delegate-stx'
  );
}

export function isRevokingDelegationTx(tx: AnyTx, poxContractId?: string) {
  return (
    isContractCall(tx) &&
    tx.contract_call.contract_id === poxContractId &&
    tx.contract_call.function_name === 'revoke-delegate-stx'
  );
}

export function isMempoolTx(tx: AnyTx): tx is MempoolTransaction {
  return tx.tx_status === 'pending';
}

export function isSendManyTx(tx: AnyTx) {
  return tx.tx_type === 'contract_call' && tx.contract_call.contract_id === SEND_MANY_CONTACT_ID;
}

export function sumTxsTotalSpentByAddress(txs: AnyTx[], address: string) {
  return txs.reduce((acc, tx) => acc.plus(sumStxTxTotal(address, tx)), new BigNumber(0));
}

interface InferSendManyTransferOperationReturn {
  direction: StxTxDirection;
  amount: BigNumber;
}
export function inferSendManyTransferOperation(
  sentAmount: string,
  receivedAmount: string
): InferSendManyTransferOperationReturn {
  const sent = new BigNumber(sentAmount);
  const received = new BigNumber(receivedAmount);
  const amount = sent.minus(received);
  const direction = amount.isNegative() ? 'received' : 'sent';
  return { amount: amount.absoluteValue(), direction };
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
