import React, { FC } from 'react';
import {
  Box,
  Flex,
  Text,
  FlexProps,
  CheckmarkCircleIcon,
  Button,
  ButtonProps,
} from '@blockstack/ui';

interface StackingFormStepProps extends FlexProps {
  title: string;
  isComplete: boolean;
  step?: number;
  onEdit?(step: number): void;
}

export const StackingStep: FC<StackingFormStepProps> = props => {
  const { step, title, isComplete, children, onEdit, ...rest } = props;
  if (!step) return null;
  return (
    <Flex flexDirection="column" mt="extra-loose" {...rest}>
      <Text
        textStyle="caption.medium"
        color="ink.600"
        textTransform="uppercase"
        fontSize="11px"
        fontWeight={600}
      >
        Step {step}
      </Text>
      <Flex alignItems="center">
        <Text textStyle="display.small" mt="extra-tight" mr="tight">
          {title}
        </Text>
        {isComplete && <CheckmarkCircleIcon size="16px" color="blue" />}
      </Flex>
      {isComplete ? (
        <Box>
          <Text
            as="button"
            onClick={() => onEdit?.(step)}
            outline={0}
            color="blue"
            textStyle="body.large.medium"
            mt="tight"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
            _focus={{ textDecoration: 'underline' }}
          >
            Edit
          </Text>
        </Box>
      ) : (
        <Box>{children}</Box>
      )}
    </Flex>
  );
};

export const StackingStepDescription: FC = ({ children }) => (
  <Text display="block" textStyle="body.large" mt="tight">
    {children}
  </Text>
);

export const StackingStepAction: FC<ButtonProps> = ({ children, ...props }) => (
  <Button size="lg" mt="loose" {...(props as unknown)}>
    {children}
  </Button>
);
