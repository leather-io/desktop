import { useSelector, useDispatch } from 'react-redux';
import { UpsertStacksNodeSettingsModal } from '@modals/upsert-stacks-node-api/upsert-stacks-node-api';
import { Button } from '@stacks/ui';
import React, { useState } from 'react';
import { NodeSelect } from './components/node-select';
import { NodeSelectItem } from './components/node-select-item';
import { SettingDescription } from './components/settings-layout';
import { SettingSection } from './components/settings-section';
import {
  selectStacksNodeApis,
  upsertStacksNodeApi,
  selectActiveNodeApi,
  setActiveStacksNode,
  removeStacksNodeApi,
  defaultNode,
} from '@store/stacks-node';
import { RootState } from '@store/index';

export const SettingsManageNodes = () => {
  const dispatch = useDispatch();

  const { nodes, selectedNodeApi } = useSelector((state: RootState) => ({
    nodes: selectStacksNodeApis(state),
    selectedNodeApi: selectActiveNodeApi(state),
  }));
  const [nodeModalOpen, setNodeModalOpen] = useState(false);
  const [operation, setOperation] = useState<'create' | 'update'>('create');

  return (
    <SettingSection title="Node settings">
      <SettingDescription>Select the node you'd like to use</SettingDescription>
      <UpsertStacksNodeSettingsModal
        isOpen={nodeModalOpen}
        selectedNode={operation === 'update' ? selectedNodeApi : undefined}
        onUpdateNode={node => dispatch(upsertStacksNodeApi(node))}
        onClose={() => setNodeModalOpen(false)}
      />
      <NodeSelect>
        {[defaultNode, ...nodes].map((node, i) => (
          <NodeSelectItem
            key={i}
            index={i}
            node={node}
            activeNode={selectedNodeApi}
            onChange={nodeId => dispatch(setActiveStacksNode(nodeId))}
            onEdit={() => (setOperation('update'), setNodeModalOpen(true))}
            onDelete={nodeId => dispatch(removeStacksNodeApi(nodeId))}
          />
        ))}
      </NodeSelect>
      <Button mt="loose" onClick={() => (setOperation('create'), setNodeModalOpen(true))}>
        Add a node
      </Button>
    </SettingSection>
  );
};
