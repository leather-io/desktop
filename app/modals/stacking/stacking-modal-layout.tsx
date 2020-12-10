import React, { FC } from 'react';
import { Button, ButtonProps, Flex, FlexProps } from '@stacks/ui';
import { border } from '@utils/border';
import { ModalHeader } from '@components/modal-header';

export const modalStyle = {
  minWidth: ['100%', '488px'],
};

interface StackingModalHeaderProps extends FlexProps {
  onSelectClose: () => void;
}

export const StackingModalHeader: FC<StackingModalHeaderProps> = ({ onSelectClose, ...rest }) => (
  <ModalHeader handleClose={onSelectClose} {...rest} />
);

export const StackingModalFooter: FC = ({ children }) => (
  <Flex justifyContent="flex-end" px="extra-loose" py="base" borderTop={border()}>
    {children}
  </Flex>
);

export const StackingModalButton: FC<ButtonProps> = ({ children, ...props }) => (
  <Button ml="base-tight" size="md" minWidth="70px" {...(props as any)}>
    {children}
  </Button>
);
