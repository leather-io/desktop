import React, { FC } from 'react';
import { Box, Flex, Text, Stack, FlexProps, color } from '@stacks/ui';

export interface StackingTermItem extends FlexProps {
  title: string;
  icon: FC<any>;
}
export const StackingTermItem: FC<StackingTermItem> = props => {
  const { title, icon: Icon, children, ...rest } = props;
  return (
    <Flex alignItems="baseline" {...rest}>
      <Box width={['12px', '16px']} mr="base-tight">
        <Icon width={['12px', '16px']} />
      </Box>
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
