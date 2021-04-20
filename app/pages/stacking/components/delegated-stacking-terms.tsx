import React, { FC } from 'react';
import type { StackProps, BoxProps } from '@stacks/ui';
import { Box, Text, ExclamationMarkCircleIcon, color, Stack } from '@stacks/ui';
import { ClockIcon } from '@components/icons/clock';
import { DelegationIcon } from '@components/icons/delegation-icon';

const RowItem: React.FC<StackProps & { icon: FC<BoxProps> }> = ({
  icon: Icon,
  children,
  ...rest
}) => (
  <Stack isInline spacing="base-tight" alignItems="start" {...rest}>
    <Box color={color('text-caption')} size="16px" transform="translateY(4px)" opacity={0.75}>
      <Icon size="16px" />
    </Box>
    <Text>{children}</Text>
  </Stack>
);

export const DelegatedStackingTerms: FC<StackProps> = props => (
  <Stack
    borderLeft={`4px solid ${color('feedback-alert')}`}
    textStyle={['body.small', 'body.large']}
    spacing="base-loose"
    pl="base"
    {...props}
  >
    <RowItem icon={DelegationIcon}>
      Your delegation service will stack on your behalf and distribute BTC rewards. Hiro can’t help
      you if they don’t pay you your BTC rewards.
    </RowItem>
    <RowItem icon={ClockIcon}>
      The pool has indefinite permission to lock your STX for up to 12 cycles at a time, unless
      you've specified a cycle limit. You can revoke anytime, but your funds will be locked until
      all cycles finish.
    </RowItem>
    <RowItem icon={ExclamationMarkCircleIcon}>
      Make sure you’ve researched and trust the pool
    </RowItem>
  </Stack>
);
