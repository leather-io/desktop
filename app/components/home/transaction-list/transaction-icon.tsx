import React, { FC } from 'react';
import { Flex, FlexProps, Spinner } from '@blockstack/ui';

import { SentArrow } from '@components/icons/sent-arrow';
import { ReceivedArrow } from '@components/icons/received-arrow';
import { LockedIcon } from '@components/icons/locked';
import { StxTxDirection } from '@utils/get-stx-transfer-direction';

type TransactionIconVariants = StxTxDirection | 'pending' | 'locked';

const iconMap: Record<TransactionIconVariants, () => JSX.Element> = {
  sent: SentArrow,
  received: ReceivedArrow,
  locked: LockedIcon,
  pending: () => <Spinner size="xs" color="#5548FF" />,
};

function getTxTypeIcon(direction: TransactionIconVariants) {
  const Icon = iconMap[direction];
  return <Icon />;
}

interface TransactionIconProps extends FlexProps {
  variant: TransactionIconVariants;
}

export const TransactionIcon: FC<TransactionIconProps> = ({ variant, ...props }) => {
  const contents = getTxTypeIcon(variant);

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
