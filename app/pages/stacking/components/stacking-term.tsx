import React, { FC } from 'react';
import { Box, BoxProps, Flex, Text, Stack, FlexProps, color } from '@stacks/ui';

export interface StackingTermItem extends FlexProps {
  title: string;
  icon: FC<BoxProps>;
}
export const StackingTermItem: FC<StackingTermItem> = props => {
  const { title, icon: Icon, children, ...rest } = props;
  return (
    <Flex alignItems="baseline" {...rest}>
      <Box width={['12px', '16px']} mr="base-tight">
        <Icon width={['12px', '16px']} />
      </Box>
      <Box>
        <Text as="h3" textStyle="body.large.medium">
          {title}
        </Text>
        <Stack mt="extra-tight" spacing="base" textStyle="body.large" color={color('text-caption')}>
          {children}
        </Stack>
      </Box>
    </Flex>
  );
};
