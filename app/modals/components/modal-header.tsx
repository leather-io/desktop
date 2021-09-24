import React, { FC } from 'react';
import { Text, color, Flex, IconButton, CloseIcon, FlexProps } from '@stacks/ui';

interface TxModalHeaderProps extends FlexProps {
  onSelectClose: () => void;
}

export const ModalHeader: FC<TxModalHeaderProps> = ({ children, onSelectClose, ...props }) => (
  <Flex
    minHeight="84px"
    px="extra-loose"
    alignItems="center"
    borderBottom={`1px solid ${color('border')}`}
    justifyContent="space-between"
    {...props}
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
