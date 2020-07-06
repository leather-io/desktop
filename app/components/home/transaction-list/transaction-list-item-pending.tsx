import React, { FC } from 'react';
import { useHover } from 'use-events';
import { Box, Flex, Text } from '@blockstack/ui';

import { listHoverProps, EnableBefore } from './transaction-list-item-hover';
import { TransactionIcon } from './transaction-icon';

interface TransactionListItemPendingProps {
  txId: string;
  onSelectTx: (txId: string) => void;
}

export const TransactionListItemPending: FC<TransactionListItemPendingProps> = ({
  txId,
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
      onClick={() => onSelectTx(txId)}
      data-txid={txId}
      {...bind}
    >
      <TransactionIcon variant="pending" mr="base-loose" />
      <Box flex={1}>
        <Text textStyle="body.large.medium" display="block">
          Pending
        </Text>
        <Text textStyle="body.small" color="ink.600">
          {'0x' + txId.substr(0, 14)}
        </Text>
      </Box>
      <Box textAlign="right">
        <Text textStyle="body.large" color="ink.900" display="block">
          xxx STX
        </Text>
        <Text textStyle="body.small" color="ink.600">
          Pending
        </Text>
      </Box>
    </Flex>
  );
};
