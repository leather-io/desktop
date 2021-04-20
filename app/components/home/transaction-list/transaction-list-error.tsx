import React, { FC } from 'react';
import { Text, Flex, BoxProps, color } from '@stacks/ui';
import { Link } from 'react-router-dom';

import { templateTxBoxProps } from './transaction-list-item-pseudo';
import { StacksNode } from '@store/stacks-node';

const linkProps: BoxProps = {
  color: 'blue',
  textStyle: 'caption.medium',
  fontSize: '12px',
  lineHeight: '22px',
  cursor: 'pointer',
};

interface TransactionListErrorProps {
  node: StacksNode;
  error: string;
}

export const TransactionListError: FC<TransactionListErrorProps> = ({ node, error }) => {
  const usingPbcHostedNode = node.id === 'default';
  return (
    <Flex {...templateTxBoxProps}>
      <Text textStyle="body.small" display="block" textAlign="center" mb="tight">
        {error}
      </Text>
      <Text
        textStyle="caption"
        color={color('text-caption')}
        textAlign="center"
        mx="base"
        lineHeight="20px"
      >
        {usingPbcHostedNode && <>Unable to connect to the Hiro Systems PBC hosted node.</>}
        {!usingPbcHostedNode && (
          <>
            Make sure you're connecting to a working Stacks Node
            <br />
            You're currently using {node.url}
            <br />
            <Link to="/settings">
              <Text {...linkProps}>Check your Stacks Node settings.</Text>
            </Link>
          </>
        )}
      </Text>
    </Flex>
  );
};
