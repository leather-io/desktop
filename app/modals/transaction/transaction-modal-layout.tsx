import React, { FC } from 'react';
import { Flex, Text, CloseIcon, Button, ButtonProps, IconButton, color } from '@stacks/ui';

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
    borderBottom={`1px solid ${color('border')}`}
    justifyContent="space-between"
  >
    <Text as="h2" textStyle="display.small">
      {children}
    </Text>
    <IconButton
      right="-16px"
      onClick={onSelectClose}
      icon={CloseIcon}
      cursor="pointer"
      p="tight"
      iconSize="12px"
      _focus={{ backgroundColor: 'ink.200' }}
    />
  </Flex>
);

export const TxModalFooter: FC = ({ children }) => (
  <Flex
    justifyContent="flex-end"
    px="extra-loose"
    py="base"
    borderTop={`1px solid ${color('border')}`}
  >
    {children}
  </Flex>
);

export const TxModalButton: FC<ButtonProps> = ({ children, ...props }) => (
  <Button ml="base-tight" size="md" minWidth="70px" {...(props as any)}>
    {children}
  </Button>
);
