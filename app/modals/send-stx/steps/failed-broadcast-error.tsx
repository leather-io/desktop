import React, { FC } from 'react';
import { Flex, Box, Text, color } from '@stacks/ui';
import { PostCoreNodeTransactionsError } from '@stacks/stacks-blockchain-api-types';

import failedCrossSvg from '../../../assets/images/failed-cross.svg';
import { ExplainerTooltip } from '@components/tooltip';

interface FailedBroadcastErrorProps {
  error: PostCoreNodeTransactionsError | null;
}

export const FailedBroadcastError: FC<FailedBroadcastErrorProps> = props => {
  const { error } = props;
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
      <Box textAlign="left" ml="loose" mt="base">
        <Text textStyle="body.small.medium">Error response</Text>
        <Flex alignItems="center" mt="extra-tight">
          <ExplainerTooltip>
            This error explains why your transaction failed to broadcast. Share this information
            when asking for help.
          </ExplainerTooltip>
          <Text textStyle="caption" ml="extra-tight" color="ink.600">
            What does this code mean?
          </Text>
        </Flex>
        {error !== null && (
          <Box mt="base">
            <Box fontSize="11px" textAlign="left">
              <Box as="pre" maxWidth="100%" whiteSpace="break-spaces">
                <code>{JSON.stringify(error, null, 2)}</code>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Flex>
  );
};
