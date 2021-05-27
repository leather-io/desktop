import React, { FC } from 'react';
import {
  Flex,
  FlexProps,
  Text,
  BoxProps,
  ButtonProps,
  Button,
  ExclamationMarkCircleIcon,
  color,
  Box,
} from '@stacks/ui';
import { Title } from '@components/title';

export const StartStackingLayout: FC<FlexProps> = props => (
  <Flex
    as="main"
    flexDirection="row"
    alignItems="center"
    mx="auto"
    minHeight="calc(100vh - 44px)"
    px="extra-loose"
    {...props}
  />
);

export const StackingOptionsCardContainer: FC<FlexProps> = props => (
  <Flex flexDirection={['column', 'column', 'column', 'row']} width="100%" my="56px" {...props} />
);

export const StackingOptionCard: FC<FlexProps> = ({ children, ...props }) => (
  <Flex
    px="loose"
    py="extra-loose"
    as="section"
    flexDirection="column"
    alignItems="center"
    borderRadius="6px"
    flex={1}
    {...props}
  >
    <Flex flexDirection="column" maxWidth={[null, null, '320', '400px']}>
      {children}
    </Flex>
  </Flex>
);

export const StackingOptionCardTitle: FC<BoxProps> = props => (
  <Title fontSize="32px" mt="base-loose" {...props} />
);

export const StackingOptionsCardDescription: FC<BoxProps> = props => (
  <Text textStyle="body.large" mt="extra-loose" {...props} />
);

export const StackingOptionCardBenefitContainer: FC<BoxProps> = props => (
  <Box mt={['tight', 'base', 'base', 'extra-loose']} mb="extra-loose" {...props} />
);

interface StackingOptionCardBenefitProps extends BoxProps {
  icon: FC;
}
export const StackingOptionCardBenefit: FC<StackingOptionCardBenefitProps> = props => {
  const { icon: Icon, ...rest } = props;
  return (
    <Flex alignItems="center" my="base">
      <Flex width="32px" justifyContent="center" alignItems="center" mr="tight">
        <Icon />
      </Flex>
      <Text display="block" textStyle="body.large.medium" color={color('text-body')} {...rest} />
    </Flex>
  );
};

export const StackingOptionCardButton: FC<ButtonProps> = props => (
  <Button alignSelf="flex-start" mt="base" {...(props as unknown as any)} />
);

export const InsufficientStackingBalanceWarning: FC<FlexProps> = props => (
  <Flex
    color={color('feedback-alert')}
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
