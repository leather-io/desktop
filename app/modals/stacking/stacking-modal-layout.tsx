import React, { FC } from 'react';
import { Flex, Text, CloseIcon, Button, ButtonProps } from '@stacks/ui';
import {border} from "@utils/border";

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
    borderBottom={border()}
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

export const StackingModalFooter: FC = ({ children }) => (
  <Flex justifyContent="flex-end" px="extra-loose" py="base" borderTop={border()}>
    {children}
  </Flex>
);

export const StackingModalButton: FC<ButtonProps> = ({ children, ...props }) => (
  <Button ml="base-tight" size="lg" minWidth="70px" {...(props as any)}>
    {children}
  </Button>
);
