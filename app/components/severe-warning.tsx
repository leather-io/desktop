import { Text, ExclamationMarkCircleIcon, Flex, FlexProps, color } from '@stacks/ui';
import React, { FC } from 'react';

export const SevereWarning: FC<FlexProps> = ({ children, ...props }) => (
  <Flex backgroundColor={color('bg-4')} width="100%" borderRadius="6px" padding="base" {...props}>
    <ExclamationMarkCircleIcon
      color={color('feedback-error')}
      width="16px"
      height="16px"
      minWidth="16px"
      mr="tight"
      mt="1px"
    />
    <Text textStyle="body.small">{children}</Text>
  </Flex>
);
