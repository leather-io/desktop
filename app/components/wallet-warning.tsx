import React, { FC } from 'react';
import { Flex, Text, FlexProps } from '@blockstack/ui';
import { ExternalLink } from './external-link';

export const WalletWarning: FC<FlexProps> = props => {
  return (
    <Flex width="100%" borderRadius="6px" mt="tight" {...props}>
      <Text textStyle="caption" color="ink.600">
        ⚠️ We're currently resolving a number of issues related to network connectivity and Ledger
        devices.
        <ExternalLink
          fontSize="12px"
          mt="extra-tight"
          href="https://www.hiro.so/questions/what-known-issues-are-currently-affecting-the-stacks-wallet"
        >
          Read more on our support page
        </ExternalLink>
      </Text>
    </Flex>
  );
};
