import React, { FC, useRef, RefObject, useEffect, MutableRefObject } from 'react';
import { useHover, useFocus } from 'use-events';
import { Box, Text } from '@blockstack/ui';

import { PendingTransaction } from '../../../store/pending-transaction';
import { toHumanReadableStx } from '../../../utils/unit-convert';
import { TransactionIcon } from './transaction-icon';
import { TransactionListItemContainer } from './transaction-list-item-container';

interface TransactionListItemPendingProps {
  tx: PendingTransaction;
  domNodeMapRef: MutableRefObject<any>;
  activeTxIdRef: MutableRefObject<string | null>;
  onSelectTx: (txId: string) => void;
}

export const TransactionListItemPending: FC<TransactionListItemPendingProps> = args => {
  const { tx, domNodeMapRef, activeTxIdRef, onSelectTx } = args;
  const [hovered, bindHover] = useHover();
  const [focused, bindFocus] = useFocus();
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (containerRef.current !== null && domNodeMapRef !== null) {
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
          Sending
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {tx.tx_id.substr(0, 28)}…
        </Text>
      </Box>
      <Box textAlign="right">
        <Text textStyle="body.large" color="ink.900" display="block">
          −{toHumanReadableStx(tx.amount)}
        </Text>
        <Text textStyle="body.small" color="ink.600">
          Pending
        </Text>
      </Box>
    </TransactionListItemContainer>
  );
};
