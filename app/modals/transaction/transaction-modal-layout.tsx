import React, { FC } from 'react';
import { Button, ButtonProps, CloseIcon, color, Flex, IconButton, Text } from '@stacks/ui';
import { border } from '@utils/border';

export const modalStyle = {
  minWidth: ['100%', '488px'],
};

interface TxModalHeaderProps {
  onSelectClose: () => void;
}

export const TxModalHeader: FC<TxModalHeaderProps> = ({ children, onSelectClose }) => (
  <Flex
    height="84px"
    px="extra-loose"
    alignItems="center"
    borderBottom={border()}
    justifyContent="space-between"
  >
    <Text color={color('text-title')} as="h2" textStyle="display.small">
      {children}
    </Text>
    <IconButton onClick={onSelectClose} iconSize="12px" icon={CloseIcon} />
  </Flex>
);

export const TxModalFooter: FC = ({ children }) => (
  <Flex justifyContent="flex-end" px="extra-loose" py="base" borderTop={border()}>
    {children}
  </Flex>
);

export const TxModalButton: FC<ButtonProps> = ({ children, ...props }) => (
  <Button ml="base-tight" size="lg" minWidth="70px" {...(props as any)}>
    {children}
  </Button>
);
