import React, { FC } from 'react';
import {
  Flex,
  FlexProps,
  Text,
  BoxProps,
  ButtonProps,
  Button,
  ExclamationMarkCircleIcon,
} from '@blockstack/ui';

export const StartStackingLayout: FC<FlexProps> = props => (
  <Flex
    flexDirection="column"
    alignItems="flex-start"
    maxWidth="976px"
    mx="auto"
    mt="150px"
    px="extra-loose"
    {...props}
  />
);

export const StackingOptionsCardContainer: FC<FlexProps> = props => (
  <Flex flexDirection={['column', 'column', 'row']} width="100%" mt="40px" {...props} />
);

export const StackingOptionCard: FC<FlexProps> = props => (
  <Flex
    flexDirection="column"
    border="1px solid #F0F0F5"
    p="loose"
    borderRadius="6px"
    flex={1}
    {...props}
  />
);

export const StackingOptionCardTitle: FC<BoxProps> = props => (
  <Text textStyle="display.small" fontSize="18px" {...props} />
);

export const StackingOptionCardAdvantage: FC<BoxProps> = props => (
  <Text fontSize="14px" color="ink.600" mt="tight" {...props} />
);

export const StackingOptionCardButton: FC<ButtonProps> = props => (
  <Button alignSelf="flex-start" mt="base" {...((props as unknown) as any)} />
);

export const InsufficientStackingBalanceWarning: FC<FlexProps> = props => (
  <Flex
    color="#FE9000"
    ml="base"
    mt="base-tight"
    alignItems="center"
    textStyle="body.small"
    {...props}
  >
    <ExclamationMarkCircleIcon width="16px" mt="1px" mr="6px" />
    Insufficient balance
  </Flex>
);
