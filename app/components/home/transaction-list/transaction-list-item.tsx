import React, { FC } from 'react';
import { useHover } from 'use-events';
import { Box, Flex, Text, useClipboard } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

import { capitalize } from '../../../utils/capitalize';
import { getStxTxDirection } from '../../../utils/get-stx-transfer-direction';
import { sumStxTxTotal } from '../../../utils/sum-stx-tx-total';
import { listHoverProps, EnableBefore } from './transaction-list-item-hover';
import { TransactionIcon } from './transaction-icon';
import { toHumanReadableStx } from '../../../utils/unit-convert';
import { useLayoutEffect, useRef } from 'react';
import {
  createTxListContextMenu,
  registerHandler,
  deregisterHandler,
} from './transaction-list-context-menu';
import { makeExplorerLink } from '../../../utils/external-links';
import { getRecipientAddress } from '../../../utils/tx-utils';

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
  onSelectTx: (txId: string) => void;
}

export const TransactionListItem: FC<TransactionListItemProps> = ({ tx, address, onSelectTx }) => {
  const direction = getStxTxDirection(address, tx);
  const sumPrefix = direction === 'sent' ? '−' : '';
  const memo =
    tx.tx_type === 'token_transfer' &&
    Buffer.from(tx.token_transfer.memo.replace('0x', ''), 'hex').toString('utf8');
  const txDate = new Date(tx.burn_block_time * 1000);
  const txDateFormatted = new Intl.DateTimeFormat('en-US', dateOptions).format(txDate);

  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, bind] = useHover();

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
    <Flex
      as={EnableBefore}
      ref={containerRef}
      mb="loose"
      cursor="pointer"
      position="relative"
      _before={listHoverProps(hovered)}
      onClick={() => onSelectTx(tx.tx_id)}
      data-txid={tx.tx_id}
      {...bind}
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
    </Flex>
  );
};
