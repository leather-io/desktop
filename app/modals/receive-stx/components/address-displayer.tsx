import React, { FC } from 'react';
import { Box, Button, color, Flex, Text, useClipboard } from '@stacks/ui';
import { ExchangeWithdrawalWarning } from '@components/testnet/exchange-withdrawal-warning';
import { isTestnet } from '@utils/network-utils';
import { HomeSelectors } from 'app/tests/features/home.selectors';
import { useAnalytics } from '@hooks/use-analytics';

interface AddressDisplayerProps {
  address: string;
}

export const AddressDisplayer: FC<AddressDisplayerProps> = props => {
  const { address } = props;

  const { hasCopied, onCopy } = useClipboard(address);
  const analytics = useAnalytics();
  const onCopyTracked = () => {
    void analytics.track('copy_address_to_clipboard');
    onCopy();
  };

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
          data-test={HomeSelectors.TextStxAddress}
          {...{ textDecoration: 'italics' }}
        >
          {address ? address : `You'll see your address when you've unlocked your wallet`}
        </Text>
      </Flex>
      <Text textStyle="caption" color={color('text-caption')} mt="base-tight">
        You do not need a memo to receive STX from elsewhere, such as a cryptocurrency exchange
      </Text>
      <Flex justifyContent="center" mt="base-tight" mb="tight">
        <Button variant="link" onClick={onCopyTracked}>
          {hasCopied ? 'Copied' : 'Copy address'}
        </Button>
      </Flex>
    </Box>
  );
};
