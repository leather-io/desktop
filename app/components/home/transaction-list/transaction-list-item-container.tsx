import React, { FC, forwardRef } from 'react';
import { Flex, FlexProps } from '@blockstack/ui';

import { EnableBefore, listHoverProps, listFocusedProps } from './transaction-list-item-pseudo';

interface TransactionListItemContainerProps extends FlexProps {
  focused: boolean;
  hovered: boolean;
  txId: string;
}

export const TransactionListItemContainer: FC<TransactionListItemContainerProps> = forwardRef(
  (args, ref) => {
    const { hovered, focused, txId, ...props } = args;
    return (
      <Flex
        ref={ref}
        as={EnableBefore}
        mb="loose"
        cursor="pointer"
        textAlign="left"
        position="relative"
        outline={0}
        data-txid={txId}
        _before={listHoverProps(hovered)}
        _after={listFocusedProps(focused)}
        {...props}
      />
    );
  }
);
