import React, { FC } from 'react';
import { ExclamationMarkCircleIcon, Flex, Text, FlexProps, color } from '@stacks/ui';

export const ExchangeWithdrawalWarning: FC<FlexProps> = props => {
  return (
    <Flex
      backgroundColor={color('bg-4')} // TODO: when new colors exist in stacks-ui, update this
      width="100%"
      borderRadius="6px"
      border="1px solid"
      borderColor={color('feedback-error')}
      padding="base"
      mt="tight"
      pr="base-loose"
      {...props}
    >
      <ExclamationMarkCircleIcon
        color={color('feedback-error')}
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
