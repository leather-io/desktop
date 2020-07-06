import React, { FC } from 'react';
import { useHover } from 'use-events';
import { Box, Flex, Text } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

import { capitalize } from '../../../utils/capitalize';
import { getStxTxDirection } from '../../../utils/get-stx-transfer-direction';
import { sumStxTxTotal } from '../../../utils/sum-stx-tx-total';
import { listHoverProps, EnableBefore } from './transaction-list-item-hover';
import { TransactionIcon } from './transaction-icon';

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
  const [hovered, bind] = useHover();

  const direction = getStxTxDirection(address, tx);
  const sumPrefix = direction === 'sent' ? '−' : '';
  const memo =
    tx.tx_type === 'token_transfer' &&
    Buffer.from(tx.token_transfer.memo.replace('0x', ''), 'hex').toString('utf8');
  const txDate = new Date(tx.burn_block_time * 1000);
  const txDateFormatted = new Intl.DateTimeFormat('en-US', dateOptions).format(txDate);

  return (
    <Flex
      as={EnableBefore}
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
          title={`Fee: ${tx.fee_rate} STX`}
          display="block"
        >
          {sumPrefix + sumStxTxTotal(tx).toString()} STX
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {memo}
        </Text>
      </Box>
    </Flex>
  );
};
