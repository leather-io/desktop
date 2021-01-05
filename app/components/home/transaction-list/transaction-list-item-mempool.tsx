import React, { FC, useRef, RefObject, useEffect, MutableRefObject } from 'react';
import { useHover, useFocus } from 'use-events';
import { Box, Text } from '@blockstack/ui';
import { MempoolTransaction } from '@blockstack/stacks-blockchain-api-types';

import { TransactionIcon } from './transaction-icon';
import { TransactionListItemContainer } from './transaction-list-item-container';
import { toHumanReadableStx } from '@utils/unit-convert';
import { sumStxTxTotal } from '@utils/sum-stx-tx-total';
import { truncateMiddle } from '@utils/tx-utils';

interface TransactionListItemMempoolProps {
  tx: MempoolTransaction;
  address: string;
  domNodeMapRef: MutableRefObject<any>;
  activeTxIdRef: MutableRefObject<string | null>;
  onSelectTx: (txId: string) => void;
}

export const TransactionListItemMempool: FC<TransactionListItemMempoolProps> = props => {
  const { tx, address, domNodeMapRef, activeTxIdRef, onSelectTx } = props;
  const [hovered, bindHover] = useHover();
  const [focused, bindFocus] = useFocus();
  const containerRef = useRef<HTMLButtonElement>(null);
  const memo =
    tx.tx_type === 'token_transfer' &&
    Buffer.from(
      tx.token_transfer.memo.replace('0x', '').replace(/^(0{2})+|(0{2})+$/g, ''),
      'hex'
    ).toString('utf8');

  useEffect(() => {
    if (containerRef.current !== null && domNodeMapRef !== null) {
      console.log('run mempool effect');
      domNodeMapRef.current[tx.tx_id] = containerRef.current;
    }
  }, [domNodeMapRef, tx.tx_id]);

  if (focused && activeTxIdRef !== null) {
    activeTxIdRef.current = tx.tx_id;
  }

  return (
    <TransactionListItemContainer
      ref={(containerRef as unknown) as RefObject<HTMLDivElement>}
      onClick={() => onSelectTx(tx.tx_id)}
      data-txid={tx.tx_id}
      focused={focused}
      hovered={hovered}
      txId={tx.tx_id}
      {...bindHover}
      {...bindFocus}
    >
      <TransactionIcon variant="pending" mr="base-loose" />
      <Box flex={1}>
        <Text textStyle="body.large.medium" display="block">
          Mempool
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {truncateMiddle(tx.sender_address)}
        </Text>
      </Box>
      <Box textAlign="right">
        <Text textStyle="body.large" color="ink.900" display="block">
          {toHumanReadableStx(sumStxTxTotal(address, tx as any).toString())}
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {memo}
        </Text>
      </Box>
    </TransactionListItemContainer>
  );
};
