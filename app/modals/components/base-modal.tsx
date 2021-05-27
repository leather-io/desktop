import React from 'react';
import { color, ControlledModal, ModalProps } from '@stacks/ui';

export const Modal: React.FC<ModalProps> = props => (
  <ControlledModal border={`1px solid ${color('border')}`} overflowY="auto" {...props} />
);
