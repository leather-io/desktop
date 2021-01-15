import React, { FC } from 'react';
import { Flex, Text, FlexProps } from '@blockstack/ui';

export const LedgerXWarning: FC<FlexProps> = props => {
  return (
    <Flex
      backgroundColor="#FCEBEC"
      width="100%"
      borderRadius="6px"
      padding="base"
      mt="tight"
      pr="base-loose"
      {...props}
    >
      <Text textStyle="body.small">
        Sending STX with Ledger Nano X devices is currently unavailable owing to a compatibility
        issue, which we're actively working to resolve. Please look for the "Update available"
        message at the top of the Stacks Wallet for a fix.
      </Text>
    </Flex>
  );
};
