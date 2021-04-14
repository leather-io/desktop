import React, { FC } from 'react';
import { Flex, Text, CloseIcon, Button, ButtonProps, IconButton } from '@stacks/ui';

export const modalStyle = {
  minWidth: ['100%', '488px'],
};

interface StackingModalHeaderProps {
  onSelectClose: () => void;
}

export const StackingModalHeader: FC<StackingModalHeaderProps> = ({ children, onSelectClose }) => (
  <Flex
    height="84px"
    px="extra-loose"
    alignItems="center"
    borderBottom="1px solid #F0F0F5"
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

export const StackingModalFooter: FC = ({ children }) => (
  <Flex justifyContent="flex-end" px="extra-loose" py="base" borderTop="1px solid #F0F0F5">
    {children}
  </Flex>
);

export const StackingModalButton: FC<ButtonProps> = ({ children, ...props }) => (
  <Button ml="base-tight" size="md" minWidth="70px" {...(props as any)}>
    {children}
  </Button>
);
