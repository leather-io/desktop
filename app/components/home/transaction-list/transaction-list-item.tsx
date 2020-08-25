import React, { FC, MutableRefObject, RefObject } from 'react';
import { useHover, useFocus } from 'use-events';
import { Box, Text, useClipboard } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

import { capitalize } from '../../../utils/capitalize';
import { getStxTxDirection } from '../../../utils/get-stx-transfer-direction';
import { sumStxTxTotal } from '../../../utils/sum-stx-tx-total';
import { TransactionIcon } from './transaction-icon';
import { toHumanReadableStx } from '../../../utils/unit-convert';
import { useLayoutEffect, useRef, useEffect } from 'react';
import {
  createTxListContextMenu,
  registerHandler,
  deregisterHandler,
} from './transaction-list-context-menu';
import { makeExplorerLink } from '../../../utils/external-links';
import { getRecipientAddress } from '../../../utils/tx-utils';
import { TransactionListItemContainer } from './transaction-list-item-container';

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

interface TransactionListItemProps {
  tx: Transaction;
  address: string;
  activeTxIdRef: MutableRefObject<any>;
  domNodeMapRef: MutableRefObject<any>;
  onSelectTx: (txId: string) => void;
}

export const TransactionListItem: FC<TransactionListItemProps> = args => {
  const { tx, address, onSelectTx, activeTxIdRef, domNodeMapRef } = args;

  const direction = getStxTxDirection(address, tx);
  const sumPrefix = direction === 'sent' ? '−' : '';
  const memo =
    tx.tx_type === 'token_transfer' &&
    Buffer.from(tx.token_transfer.memo.replace('0x', ''), 'hex').toString('utf8');
  const txDate = new Date(tx.burn_block_time_iso);
  const txDateFormatted = new Intl.DateTimeFormat('en-US', dateOptions).format(txDate);

  const containerRef = useRef<HTMLButtonElement>(null);
  const [hovered, bindHover] = useHover();
  const [focused, bindFocus] = useFocus();

  useEffect(() => {
    if (containerRef.current !== null && domNodeMapRef !== null) {
      domNodeMapRef.current[tx.tx_id] = containerRef.current;
    }
  }, [domNodeMapRef, tx.tx_id]);

  if (focused && activeTxIdRef !== null) {
    activeTxIdRef.current = tx.tx_id;
  }

  const copy = {
    txid: useClipboard(tx.tx_id),
    recipientAddress: useClipboard(getRecipientAddress(tx) || ''),
    memo: useClipboard(memo || ''),
    date: useClipboard(txDate.toISOString()),
    txDetails: useClipboard(JSON.stringify(tx, null, 2)),
    explorerLink: useClipboard(makeExplorerLink(tx.tx_id)),
  };

  useLayoutEffect(() => {
    const el = containerRef.current;
    const contextMenuHandler = () => createTxListContextMenu({ tx, copy });
    registerHandler(el, contextMenuHandler);
    return () => deregisterHandler(el, contextMenuHandler);
  }, [tx, copy]);

  return (
    <TransactionListItemContainer
      // UI library bug where it is only considered HTMLDivElement
      // type casting here so type is correct elsewhere
      ref={(containerRef as unknown) as RefObject<HTMLDivElement>}
      onClick={() => onSelectTx(tx.tx_id)}
      focused={focused}
      hovered={hovered}
      txId={tx.tx_id}
      {...bindHover}
      {...bindFocus}
    >
      <TransactionIcon variant={direction} mr="base-loose" />
      <Box flex={1}>
        <Text textStyle="body.large.medium" display="block">
          {capitalize(direction)}
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {txDateFormatted}
        </Text>
      </Box>
      <Box textAlign="right">
        <Text
          textStyle="body.large"
          color="ink.900"
          title={`Fee: ${toHumanReadableStx(tx.fee_rate)}`}
          display="block"
        >
          {sumPrefix + toHumanReadableStx(sumStxTxTotal(address, tx).toString())}
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {memo}
        </Text>
      </Box>
    </TransactionListItemContainer>
  );
};
