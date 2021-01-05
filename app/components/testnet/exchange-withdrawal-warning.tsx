import React, { FC } from 'react';
import { ExclamationMarkCircleIcon, Flex, Text, FlexProps } from '@blockstack/ui';

export const ExchangeWithdrawalWarning: FC<FlexProps> = props => {
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
      <ExclamationMarkCircleIcon
        color="#CF0000"
        width="16px"
        height="16px"
        minWidth="16px"
        mr="tight"
        mt="1px"
      />
      <Text textStyle="body.small">
        <strong>DO NOT withdraw</strong> from cryptocurrency exchanges, such as Binance, to this
        wallet. <br /> This wallet is for <strong>testnet STX only</strong>.
      </Text>
    </Flex>
  );
};
