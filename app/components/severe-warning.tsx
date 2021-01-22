import { Text, ExclamationMarkCircleIcon, Flex, FlexProps } from '@blockstack/ui';
import React, { FC } from 'react';

export const SevereWarning: FC<FlexProps> = ({ children, ...props }) => (
  <Flex backgroundColor="#FCEBEC" width="100%" borderRadius="6px" padding="base" {...props}>
    <ExclamationMarkCircleIcon
      color="#CF0000"
      width="16px"
      height="16px"
      minWidth="16px"
      mr="tight"
      mt="1px"
    />
    <Text textStyle="body.small">{children}</Text>
  </Flex>
);
