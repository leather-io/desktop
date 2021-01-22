import React, { FC } from 'react';
import { Box, Button, Flex, Text, useClipboard } from '@blockstack/ui';
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
        border="1px solid #E1E3E8"
        height="48px"
        borderRadius="6px"
        width="100%"
      >
        <Text
          color={address ? 'ink' : 'ink.400'}
          fontSize="13px"
          {...{ textDecoration: 'italics' }}
        >
          {address ? address : `You'll see your address when you've unlocked your wallet`}
        </Text>
      </Flex>
      <Flex justifyContent="center" mt="base-tight" mb="tight">
        <Button variant="link" onClick={onCopy} mr="tight">
          {hasCopied ? 'Copied' : 'Copy address'}
        </Button>
      </Flex>
    </Box>
  );
};
