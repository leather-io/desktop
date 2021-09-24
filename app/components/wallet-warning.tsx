import React, { FC } from 'react';
import { Flex, Text, FlexProps, color } from '@stacks/ui';
import { ExternalLink } from './external-link';

export const WalletWarning: FC<FlexProps> = props => {
  return (
    <Flex width="100%" borderRadius="6px" mt="tight" {...props}>
      <Text textStyle="caption" color={color('text-caption')}>
        ⚠️ Please check our status page for known issues if you’re experiencing any difficulties.
        <ExternalLink
          display="inline-block"
          ml="base"
          fontSize="12px"
          mt="extra-tight"
          href="https://www.hiro.so/questions/what-known-issues-are-currently-affecting-the-stacks-wallet"
        >
          Check status
        </ExternalLink>
      </Text>
    </Flex>
  );
};
