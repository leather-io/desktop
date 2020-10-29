import React, { FC } from 'react';
import { Box, Flex, Text } from '@blockstack/ui';

import { StacksNode } from '@store/stacks-node';

interface NodeSelectItemProps {
  node: StacksNode;
  activeNode: StacksNode;
  index: number;
  onChange(activeNodeId: string): void;
  onEdit(): void;
  onDelete(activeNodeId: string): void;
}

export const NodeSelectItem: FC<NodeSelectItemProps> = props => {
  const { node, activeNode, index, onChange, onEdit, onDelete } = props;

  return (
    <Flex
      minHeight="72px"
      p="base"
      as="label"
      borderTop={index > 0 ? '1px solid #F0F0F5' : null}
      {...{ htmlFor: node.id }}
    >
      <Flex width="100%" align-items="stretch">
        <Box position="relative" top="-3px">
          <input
            type="radio"
            id={node.id}
            name="select-node"
            value={node.id}
            checked={node.id === activeNode.id}
            onChange={e => onChange(e.target.value)}
          />
        </Box>
        <Flex ml="base-tight" width="100%" flexDirection={['column', 'row']}>
          <Box>
            <Text
              textStyle="body.small"
              fontWeight={500}
              display="block"
              style={{ wordBreak: 'break-all' }}
            >
              {node.name}
            </Text>
            <Text
              textStyle="caption"
              display="block"
              color="ink.600"
              mt="extra-tight"
              style={{ wordBreak: 'break-all' }}
            >
              {node.url}
            </Text>
          </Box>
          <Flex justifyContent={['flex-start', 'flex-end']} flexGrow={1} alignItems="baseline">
            {activeNode.id === node.id && node.id !== 'default' && (
              <>
                <Box
                  as="button"
                  textStyle="body.small.medium"
                  mr="base"
                  ml={[null, null, 'base']}
                  color="blue"
                  outline={0}
                  mt={['tight', 'unset']}
                  _focus={{ textDecoration: 'underline' }}
                  onClick={() => onEdit()}
                >
                  Edit
                </Box>
                <Box
                  as="button"
                  textStyle="body.small.medium"
                  color="feedback.error"
                  mt={['tight', 'unset']}
                  outline={0}
                  _focus={{ textDecoration: 'underline' }}
                  onClick={() => onDelete(activeNode.id)}
                >
                  Delete
                </Box>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
