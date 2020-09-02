import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Flex, Text, Button } from '@blockstack/ui';

import routes from '../../constants/routes.json';
import { useBackButton } from '../../hooks/use-back-url.hook';
import { selectWalletType } from '../../store/keys/keys.reducer';
import { ResetWalletModal } from '../../modals/reset-wallet/reset-wallet-modal';

import { RootState } from '../../store';
import { UpsertStacksNodeSettingsModal } from '../../modals/upsert-stacks-node-api/upsert-stacks-node-api';
import {
  selectStacksNodeApis,
  upsertStacksNodeApi,
  selectActiveNodeApi,
  setActiveStacksNode,
  removeStacksNodeApi,
} from '../../store/stacks-node';

export const Settings = () => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [nodeModalOpen, setNodeModalOpen] = useState(false);

  const { nodes, selectedNodeApi } = useSelector((state: RootState) => ({
    nodes: selectStacksNodeApis(state),
    selectedNodeApi: selectActiveNodeApi(state),
  }));
  const walletType = useSelector(selectWalletType);
  const dispatch = useDispatch();
  const [operation, setOperation] = useState<'add' | 'edit'>('add');

  useBackButton(routes.HOME);

  return (
    <>
      <ResetWalletModal isOpen={resetModalOpen} onClose={() => setResetModalOpen(false)} />

      <UpsertStacksNodeSettingsModal
        isOpen={nodeModalOpen}
        selectedNode={operation === 'edit' ? selectedNodeApi : undefined}
        onUpdateNode={node => dispatch(upsertStacksNodeApi(node))}
        onClose={() => setNodeModalOpen(false)}
      />

      <Flex
        flexDirection="column"
        maxWidth="960px"
        mb="extra-loose"
        mx={['loose', 'loose', 'extra-loose', 'auto']}
      >
        <Box mt="68px">
          <Text textStyle="display.large" fontSize="32px" display="block">
            Settings
          </Text>
          <Text textStyle="display.small" mt="68px" display="block">
            Node settings
          </Text>
          <Text textStyle="body.large" mt="tight" display="block">
            Select the node you'd like to use
          </Text>
          <Box
            mt="extra-loose"
            boxShadow="low"
            border="1px solid #F0F0F5"
            borderRadius="8px"
            width={[null, '432px']}
          >
            {nodes.map((node, i) => (
              <Flex
                minHeight="72px"
                p="base"
                as="label"
                key={node.id}
                borderTop={i > 0 ? '1px solid #F0F0F5' : null}
                {...{ htmlFor: node.id }}
              >
                <Flex width="100%" align-items="stretch">
                  <Box position="relative" top="-3px">
                    <input
                      type="radio"
                      id={node.id}
                      name="select-node"
                      value={node.id}
                      checked={node.id === selectedNodeApi.id}
                      onChange={e => dispatch(setActiveStacksNode(e.target.value))}
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
                    <Flex
                      justifyContent={['flex-start', 'flex-end']}
                      flexGrow={1}
                      alignItems="baseline"
                    >
                      {selectedNodeApi.id === node.id && node.id !== 'default' && (
                        <>
                          <Box
                            as="button"
                            textStyle="body.small.medium"
                            mr="base"
                            ml={[null, null, 'base']}
                            color="blue"
                            outline={0}
                            mt={['tight', 'unset']}
                            onClick={() => {
                              setOperation('edit');
                              setNodeModalOpen(true);
                            }}
                            _focus={{ textDecoration: 'underline' }}
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
                            onClick={() => dispatch(removeStacksNodeApi(selectedNodeApi.id))}
                          >
                            Delete
                          </Box>
                        </>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            ))}
          </Box>
          <Button
            mt="loose"
            onClick={() => {
              setOperation('add');
              setNodeModalOpen(true);
            }}
          >
            Add a node
          </Button>
        </Box>
        <Box mt="64px">
          <Text textStyle="display.small" display="block">
            Reset wallet
          </Text>
          <Text as="h3" textStyle="body.large" display="block" mt="tight">
            When you reset your wallet,
            {walletType === 'software' &&
              ' you will need to sign back in with your 24-word Secret Key.'}
            {walletType === 'ledger' && ' you will need to reauthenticate with your Ledger device'}
          </Text>
          <Button
            mt="loose"
            style={{ background: '#D4001A' }}
            onClick={() => setResetModalOpen(true)}
          >
            Reset wallet
          </Button>
        </Box>
      </Flex>
    </>
  );
};
