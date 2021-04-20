import React, { FC } from 'react';
import { Box, Button, color, Flex, Text, useClipboard } from '@stacks/ui';
import { ExchangeWithdrawalWarning } from '@components/testnet/exchange-withdrawal-warning';
import { isTestnet } from '@utils/network-utils';

interface AddressDisplayerProps {
  address: string;
}

export const AddressDisplayer: FC<AddressDisplayerProps> = props => {
  const { address } = props;

  const { hasCopied, onCopy } = useClipboard(address);

  return (
    <Box>
      {isTestnet() && <ExchangeWithdrawalWarning mt="loose" />}

      <Text textStyle="body.small.medium" mt="loose" display="block">
        Your STX address
      </Text>

      <Flex
        mt="base-tight"
        justifyContent="center"
        alignItems="center"
        border={`1px solid ${color('border')}`}
        height="48px"
        borderRadius="6px"
        width="100%"
      >
        <Text
          color={address ? color('text-title') : color('text-caption')}
          fontSize="13px"
          {...{ textDecoration: 'italics' }}
        >
          {address ? address : `You'll see your address when you've unlocked your wallet`}
        </Text>
      </Flex>
      <Flex justifyContent="center" mt="base-tight" mb="tight">
        <Button variant="link" onClick={onCopy}>
          {hasCopied ? 'Copied' : 'Copy address'}
        </Button>
      </Flex>
    </Box>
  );
};
