import React, { FC } from 'react';
import { Flex, Box, Text } from '@blockstack/ui';

import failedCrossSvg from '../../../assets/images/failed-cross.svg';

interface FailedBroadcastErrorProps {
  errorReason?: string;
}

export const FailedBroadcastError: FC<FailedBroadcastErrorProps> = props => {
  let errorBody: JSX.Element;
  switch (props.errorReason) {
    case 'ConflictingNonceInMempool':
      errorBody = (
        <>
          <Text as="h1" textStyle="display.small" display="block">
            Conflicting Nonce In Mempool
          </Text>
          <Text as="p" mt="base" mb="extra-loose" mx="loose" display="block" textStyle="body.large">
            A transaction with this nonce value is already in the mempool. Try again shortly.
          </Text>
        </>
      );
      break;
    case 'BadNonce':
      errorBody = (
        <>
          <Text as="h1" textStyle="display.small" display="block">
            Bad Nonce
          </Text>
          <Text as="p" mt="base" mb="extra-loose" mx="loose" display="block" textStyle="body.large">
            Transaction failed owing to a bad nonce value. Try again shortly.
          </Text>
        </>
      );
      break;
    default:
      errorBody = (
        <>
          <Text as="h1" textStyle="display.small" display="block">
            Your transaction failed to verify
          </Text>
          <Text as="p" mt="base" mb="extra-loose" mx="loose" display="block" textStyle="body.large">
            Please make sure you are signing your transaction with the same Ledger or Secret Key
            used to set up your wallet.
          </Text>
        </>
      );
  }
  return (
    <Flex flexDirection="column" textAlign="center">
      <Box mx="auto" my="extra-loose">
        <img src={failedCrossSvg} alt="" />
      </Box>
      {errorBody}
    </Flex>
  );
};
