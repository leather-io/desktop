import React, { FC } from 'react';
import { Flex, FlexProps, Spinner } from '@blockstack/ui';

import { SentArrow } from '@components/icons/sent-arrow';
import { ReceivedArrow } from '@components/icons/received-arrow';
import { LockedIcon } from '@components/icons/locked';
import { StxTxDirection } from '@utils/get-stx-transfer-direction';

const iconMap: { [key in StxTxDirection]: () => JSX.Element } = {
  sent: SentArrow,
  received: ReceivedArrow,
  locked: LockedIcon,
};

function getDirectionalArrowIcon(direction: StxTxDirection) {
  const Icon = iconMap[direction];
  return <Icon />;
}

interface TransactionIconProps extends FlexProps {
  variant: StxTxDirection | 'pending';
}

export const TransactionIcon: FC<TransactionIconProps> = ({ variant, ...props }) => {
  const contents =
    variant === 'pending' ? (
      <Spinner size="xs" color="#5548FF" />
    ) : (
      getDirectionalArrowIcon(variant)
    );
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      border="1px solid #F0F0F5"
      background="white"
      borderRadius="8px"
      minWidth="48px"
      minHeight="48px"
      maxWidth="48px"
      maxHeight="48px"
      {...props}
    >
      {contents}
    </Flex>
  );
};
