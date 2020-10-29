import React, { FC } from 'react';
import { Flex, Text, CloseIcon, Button, ButtonProps } from '@blockstack/ui';

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
    borderBottom="1px solid #F0F0F5"
    justifyContent="space-between"
  >
    <Text as="h2" textStyle="display.small">
      {children}
    </Text>
    <Button
      type="button"
      right="-16px"
      onClick={onSelectClose}
      variant="unstyled"
      cursor="pointer"
      p="tight"
      _focus={{ backgroundColor: 'ink.200' }}
    >
      <CloseIcon size="12px" color="ink.400" />
    </Button>
  </Flex>
);

export const TxModalFooter: FC = ({ children }) => (
  <Flex justifyContent="flex-end" px="extra-loose" py="base" borderTop="1px solid #F0F0F5">
    {children}
  </Flex>
);

export const TxModalButton: FC<ButtonProps> = ({ children, ...props }) => (
  <Button ml="base-tight" size="lg" minWidth="70px" {...(props as any)}>
    {children}
  </Button>
);
