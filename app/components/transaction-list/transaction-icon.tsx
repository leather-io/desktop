import React, { FC } from 'react';
import { Flex, FlexProps } from '@blockstack/ui';
import { SentArrow } from '../icons/sent-arrow';
import { ReceivedArrow } from '../icons/received-arrow';

type TransactionDirection = 'sent' | 'received';

const iconMap: { [key in TransactionDirection]: () => JSX.Element } = {
  sent: SentArrow,
  received: ReceivedArrow,
};

function getDirectionalArrowIcon(direction: TransactionDirection) {
  const Icon = iconMap[direction];
  return <Icon />;
}

interface TransactionIconProps extends Omit<FlexProps, 'direction'> {
  direction: TransactionDirection;
}

export const TransactionIcon: FC<TransactionIconProps> = ({ direction, ...props }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      border="1px solid #F0F0F5"
      background="white"
      borderRadius="8px"
      minWidth="48px"
      minHeight="48px"
      {...props}
    >
      {getDirectionalArrowIcon(direction)}
    </Flex>
  );
};
