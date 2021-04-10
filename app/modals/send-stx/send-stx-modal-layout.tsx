import React, { FC } from 'react';
import { Flex, Button, ButtonProps, color } from '@stacks/ui';

export const modalStyle = {
  minWidth: ['100%', '488px'],
};

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
