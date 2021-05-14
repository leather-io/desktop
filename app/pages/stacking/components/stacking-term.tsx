import React, { FC } from 'react';
import { Flex, Text, Stack, FlexProps, color } from '@stacks/ui';

export interface StackingTermItem extends FlexProps {
  title: string;
  icon: FC<any>;
}
export const StackingTermItem: FC<StackingTermItem> = props => {
  const { title, icon: Icon, children, ...rest } = props;
  return (
    <Flex alignItems="baseline" {...rest}>
      <Flex width="16px" mr="base-tight">
        <Icon width="16px" height="16px" />
      </Flex>
      <Stack spacing="extra-tight">
        <Text as="h3" textStyle="body.large.medium">
          {title}
        </Text>
        <Stack spacing="base" textStyle="body.large" color={color('text-caption')}>
          {children}
        </Stack>
      </Stack>
    </Flex>
  );
};
