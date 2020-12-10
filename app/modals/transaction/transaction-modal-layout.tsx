import React, { FC } from 'react';
import { Button, ButtonProps, Flex } from '@stacks/ui';
import { border } from '@utils/border';
import { ModalHeader } from '@components/modal-header';

export const modalStyle = {
  minWidth: ['100%', '488px'],
};

interface TxModalHeaderProps {
  onSelectClose: () => void;
}

export const TxModalHeader: FC<TxModalHeaderProps> = ({ children, onSelectClose }) => (
  <ModalHeader handleClose={onSelectClose}>{children}</ModalHeader>
);

export const TxModalFooter: FC = ({ children }) => (
  <Flex justifyContent="flex-end" px="extra-loose" py="base" borderTop={border()}>
    {children}
  </Flex>
);

export const TxModalButton: FC<Omit<ButtonProps, 'size'>> = ({ children, ...props }) => (
  <Button ml="base-tight" size="md" minWidth="70px" {...props}>
    {children}
  </Button>
);
