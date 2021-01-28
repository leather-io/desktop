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

import { StackingStepView } from '../utils/use-stacking-form-step';
interface StackingFormStepProps extends FlexProps {
  title: string;
  isComplete: boolean;
  state: StackingStepView;
  value?: string;
  step?: number;
  onEdit?(step: number): void;
}

export const StackingStep: FC<StackingFormStepProps> = props => {
  const { step, title, state, isComplete, value, children, onEdit, ...rest } = props;
  if (!step) return null;
  const showCompeteCheckmark = isComplete && state !== 'open';
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
        {showCompeteCheckmark && <CheckmarkCircleIcon size="16px" color="blue" />}
      </Flex>
      {state === 'closed' ? (
        <Box>
          {value && (
            <Text display="block" mt="tight" textStyle="body.large">
              {value}
            </Text>
          )}
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
