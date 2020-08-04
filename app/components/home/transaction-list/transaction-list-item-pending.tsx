import React, { FC } from 'react';
import { useHover } from 'use-events';
import { Box, Flex, Text } from '@blockstack/ui';

import { PendingTransaction } from '../../../store/pending-transaction';
import { listHoverProps, EnableBefore } from './transaction-list-item-hover';
import { TransactionIcon } from './transaction-icon';
import { toHumanReadableStx } from '../../../utils/unit-convert';

interface TransactionListItemPendingProps {
  tx: PendingTransaction;
  onSelectTx: (txId: string) => void;
}

export const TransactionListItemPending: FC<TransactionListItemPendingProps> = ({
  tx,
  onSelectTx,
}) => {
  const [hovered, bind] = useHover();

  return (
    <Flex
      as={EnableBefore}
      mb="loose"
      cursor="pointer"
      position="relative"
      _before={listHoverProps(hovered)}
      onClick={() => onSelectTx(tx.txId)}
      data-txid={tx.txId}
      {...bind}
    >
      <TransactionIcon variant="pending" mr="base-loose" />
      <Box flex={1}>
        <Text textStyle="body.large.medium" display="block">
          Sending
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {tx.txId.substr(0, 28)}…
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
    </Flex>
  );
};
