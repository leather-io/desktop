import React from 'react';
import { CloseIcon, color, IconButton, IconButtonProps } from '@stacks/ui';

export const ModalCloseButtom: React.FC<Omit<IconButtonProps, 'icon'>> = props => (
  <IconButton
    icon={CloseIcon}
    color={color('icon')}
    _hover={{
      color: color('text-title'),
    }}
    iconSize="12px"
    size="36px"
    {...props}
  />
);
