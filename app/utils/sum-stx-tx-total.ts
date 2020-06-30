import type { Transaction, TransactionEvent } from '@blockstack/stacks-blockchain-sidecar-types';
import BigNumber from 'bignumber.js';

export function sumStxTxTotal(tx: Transaction) {
  if (tx.tx_type === 'token_transfer') {
    return new BigNumber(tx.token_transfer.amount).plus(tx.fee_rate);
  }
  if (tx.tx_type === 'coinbase' || tx.tx_type === 'poison_microblock')
    return new BigNumber(tx.fee_rate);

  const initialValue = new BigNumber(0);
  const sumEventTransferHandler = (prev: BigNumber, current: TransactionEvent) =>
    current.event_type === 'stx_asset' && current.asset.asset_event_type === 'transfer'
      ? new BigNumber(current.asset.amount || 0).plus(prev)
      : initialValue;
  return tx.events.reduce(sumEventTransferHandler, initialValue).plus(tx.fee_rate);
}
