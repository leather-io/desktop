import React from 'react';
import { FlexProps, Flex, Text, color } from '@stacks/ui';
import { border } from '@utils/border';
import { ModalCloseButtom } from '@components/modal-close-button';

export const ModalHeader: React.FC<{ handleClose(): void } & FlexProps> = ({
  children,
  handleClose,
  ...rest
}) => (
  <Flex
    height="84px"
    px="extra-loose"
    alignItems="center"
    borderBottom={border()}
    justifyContent="space-between"
    {...rest}
  >
    <Text as="h2" color={color('text-title')} textStyle="display.small">
      {children}
    </Text>
    <ModalCloseButtom onClick={handleClose} />
  </Flex>
);
