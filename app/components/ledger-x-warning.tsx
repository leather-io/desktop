import React, { FC } from 'react';
import { Flex, Text, FlexProps } from '@blockstack/ui';

export const LedgerXWarning: FC<FlexProps> = props => {
  return (
    <Flex
      width="100%"
      borderRadius="6px"
      padding="base"
      mt="tight"
      pr="base-loose"
      textStyle="caption"
      {...props}
    >
      <Text textStyle="body.small">
        Some users are reporting difficulty connecting or signing transactions with their Ledger
        devices. We're working on a fix, and we'll update this message when an update is available
        in the Ledger Live store.
      </Text>
    </Flex>
  );
};
