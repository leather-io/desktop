import React, { FC, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useFormik } from 'formik';
import { Modal, ButtonGroup, Button, Box, Text, Input } from '@blockstack/ui';
import * as yup from 'yup';

import { StacksNode } from '@store/stacks-node';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { capitalize } from '@utils/capitalize';
import { Api } from '@api/api';
import { safeAwait } from '@utils/safe-await';
import { generateRandomHexString } from '@crypto/key-generation';
import { TxModalHeader, TxModalFooter } from '../transaction/transaction-modal-layout';

interface AddNodeSettingsProps {
  isOpen: boolean;
  selectedNode?: StacksNode;
  onUpdateNode(node: StacksNode): void;
  onClose(): void;
}

export const UpsertStacksNodeSettingsModal: FC<AddNodeSettingsProps> = props => {
  const { isOpen, selectedNode, onClose, onUpdateNode } = props;

  const [loading, setLoading] = useState(false);

  useHotkeys('esc', onClose, []);
  const nameFieldRef = useRef<any>();
  const form = useFormik({
    initialValues: {
      name: '',
      url: '',
    },
    validationSchema: yup.object({
      name: yup.string().max(64).required(),
      url: yup.string().url().required(),
    }),
    async onSubmit() {
      setLoading(true);
      const [error, success] = await safeAwait(new Api(form.values.url).getNodeStatus());
      if (error) {
        setLoading(false);
        form.setErrors({ url: 'Unable to connect to the node' });
        return;
      }
      if (success && success.data.status === 'ready') {
        onUpdateNode({ id: generateRandomHexString(), ...selectedNode, ...form.values });
        onClose();
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (!selectedNode) return form.resetForm();
    void form.setValues(selectedNode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedNode]);

  useEffect(() => {
    if (isOpen) nameFieldRef.current?.focus();
    if (!isOpen) return;
    return () => form.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const changeVerb = selectedNode ? 'Edit' : 'Add';

  const header = <TxModalHeader onSelectClose={onClose}>{changeVerb} a node</TxModalHeader>;
  const footer = (
    <TxModalFooter>
      <ButtonGroup size="lg">
        <Button type="button" mode="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {changeVerb} node
        </Button>
      </ButtonGroup>
    </TxModalFooter>
  );
  return (
    <Modal
      as="form"
      onSubmit={(e: React.FormEvent<HTMLDivElement>) => form.handleSubmit(e as any)}
      isOpen={isOpen}
      headerComponent={header}
      footerComponent={footer}
      minWidth={['100%', '488px']}
    >
      <Box m="extra-loose">
        <Text textStyle="body.small" lineHeight="20px">
          Enter an address from the Stacks Blockchain API that proxies a node. Before using a node,
          make sure you review and trust the host before configuring a new API.
        </Text>
        <Box mt="loose">
          <Text textStyle="body.small.medium" as="label" {...{ htmlFor: 'name' }}>
            Name
          </Text>
          <Input
            ref={nameFieldRef}
            mt="base-tight"
            id="name"
            onChange={form.handleChange}
            value={form.values.name}
          />
          {form.touched.name && form.errors.name && (
            <ErrorLabel>
              <ErrorText>{capitalize(form.errors.name)}</ErrorText>
            </ErrorLabel>
          )}
        </Box>
        <Box mt="loose">
          <Text textStyle="body.small.medium" as="label" {...{ htmlFor: 'url' }}>
            URL
          </Text>
          <Input mt="base-tight" id="url" onChange={form.handleChange} value={form.values.url} />
          {form.touched.url && form.errors.url && (
            <ErrorLabel>
              <ErrorText>{capitalize(form.errors.url)}</ErrorText>
            </ErrorLabel>
          )}
        </Box>
      </Box>
    </Modal>
  );
};
