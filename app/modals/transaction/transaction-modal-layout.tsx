import React, { FC } from 'react';
import { Flex, Text, CloseIcon, Button } from '@blockstack/ui';

export const modalStyle = {
  minWidth: ['100%', '488px'],
};

export const buttonStyle = {
  size: 'lg',
  minWidth: '70px',
} as const;

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

export const TxModalPreview: FC = ({ children }) => (
  <Flex flexDirection="column" fontSize="14px" mx="extra-loose" mt="tight">
    {children}
  </Flex>
);

interface TxModalPreviewItemProps {
  label: string;
}

export const TxModalPreviewItem: FC<TxModalPreviewItemProps> = ({ label, children }) => (
  <Flex alignItems="center" height="64px" borderBottom="1px solid #F0F0F5">
    <Text textStyle="body.small.medium" width="70px">
      {label}
    </Text>
    <Text>{children}</Text>
  </Flex>
);
