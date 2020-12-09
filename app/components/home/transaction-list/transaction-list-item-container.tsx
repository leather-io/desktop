import React from 'react';
import { Flex, FlexProps } from '@stacks/ui';

import { listFocusedProps, listHoverProps } from './transaction-list-item-pseudo';
import { forwardRefWithAs } from '@stacks/ui-core';

interface TransactionListItemContainerProps extends FlexProps {
  focused: boolean;
  hovered: boolean;
  txId: string;
}

export const TransactionListItemContainer = forwardRefWithAs<
  TransactionListItemContainerProps,
  'div'
>((args, ref) => {
  const { hovered, focused, txId, ...props } = args;

  return (
    <Flex
      ref={ref}
      mb="loose"
      cursor="pointer"
      textAlign="left"
      position="relative"
      outline={0}
      zIndex={2}
      data-txid={txId}
      _before={listHoverProps(hovered)}
      _after={listFocusedProps(focused)}
      {...props}
    />
  );
});
