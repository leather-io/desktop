import React, { FC, useState } from 'react';
import { Flex, Box, Text, Button, color } from '@stacks/ui';
import { PostCoreNodeTransactionsError } from '@blockstack/stacks-blockchain-api-types';

import failedCrossSvg from '../../../assets/images/failed-cross.svg';

interface FailedBroadcastErrorProps {
  error: PostCoreNodeTransactionsError | null;
}

export const FailedBroadcastError: FC<FailedBroadcastErrorProps> = props => {
  const { error } = props;
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  let errorBody: JSX.Element;
  switch (error?.reason) {
    case 'ConflictingNonceInMempool':
      errorBody = (
        <>
          <Text as="h1" textStyle="display.small" display="block">
            Conflicting Nonce In Mempool
          </Text>
          <Text
            as="p"
            mt="base"
            mb="extra-loose"
            mx="loose"
            display="block"
            textStyle="body.small"
            color={color('text-caption')}
          >
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
          <Text
            as="p"
            mt="base"
            mb="extra-loose"
            mx="extra-loose"
            display="block"
            textStyle="body.small"
            color={color('text-caption')}
          >
            Transaction failed owing to a bad nonce value. Try again shortly.
          </Text>
        </>
      );
      break;
    default:
      errorBody = (
        <Box px="extra-loose">
          <Text as="h1" textStyle="display.small" display="block">
            Failed to broadcast transaction
          </Text>
          <Text textStyle="body.small" color={color('text-caption')} mt="tight" display="block">
            The Stacks Blockchain API you're connected to returned a HTTP error code, preventing
            this transaction from broadcasting.
          </Text>
        </Box>
      );
  }
  return (
    <Flex flexDirection="column" textAlign="center" mb="extra-loose">
      <Box mx="auto" my="extra-loose">
        <img src={failedCrossSvg} alt="" />
      </Box>
      {errorBody}
      {error !== null && (
        <Box mt="base-tight">
          <Button variant="link" my="base" onClick={() => setShowErrorDetails(!showErrorDetails)}>
            {showErrorDetails ? 'Hide' : 'Show'} response details
          </Button>
          {showErrorDetails && (
            <Box fontSize="12px" textAlign="left" px="base">
              <Box as="pre" maxWidth="100%" overflowX="scroll">
                <code>{JSON.stringify(error, null, 2)}</code>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Flex>
  );
};
