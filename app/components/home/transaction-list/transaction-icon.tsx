import { RevokedDelegationIcon } from '../../icons/revoked-delegation-icon';
import { DelegatedIcon } from '@components/icons/delegated-icon';
import { LockedIcon } from '@components/icons/locked';
import { ReceivedArrow } from '@components/icons/received-arrow';
import { SentArrow } from '@components/icons/sent-arrow';
import { Flex, FlexProps, Box, Spinner, FailedIcon, color } from '@stacks/ui';
import { StxTxDirection } from '@utils/get-stx-transfer-direction';
import React, { FC } from 'react';

export type TransactionIconVariants =
  | StxTxDirection
  | 'pending'
  | 'locked'
  | 'delegated'
  | 'revoked'
  | 'failed'
  | 'default';

function Failed() {
  return <FailedIcon size="16px" />;
}

function Pending() {
  return <Spinner size="xs" color={color('brand')} />;
}

function Default() {
  return (
    <Box width="16px" height="16px" borderRadius="50%" backgroundColor={color('text-caption')} />
  );
}

const iconMap: Record<TransactionIconVariants, FC> = {
  sent: SentArrow,
  received: ReceivedArrow,
  locked: LockedIcon,
  delegated: DelegatedIcon,
  revoked: RevokedDelegationIcon,
  failed: Failed,
  pending: Pending,
  default: Default,
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
      border={`1px solid ${color('border')}`}
      background={color('bg')}
      borderRadius="8px"
      minWidth="48px"
      minHeight="48px"
      maxWidth="48px"
      maxHeight="48px"
      color={color('brand')}
      {...props}
    >
      {contents}
    </Flex>
  );
};
