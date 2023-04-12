import { color, ControlledModal, ModalProps } from '@stacks/ui';
import React from 'react';

export const Modal: React.FC<ModalProps> = props => (
  <ControlledModal border={`1px solid ${color('border')}`} overflowY="auto" {...props} />
);
