import React, { FC } from 'react';
import { Text, color, Flex, IconButton, CloseIcon } from '@stacks/ui';

interface TxModalHeaderProps {
  onSelectClose: () => void;
}

export const ModalHeader: FC<TxModalHeaderProps> = ({ children, onSelectClose }) => (
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
