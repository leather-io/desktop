import React, { FC } from 'react';
import {
  Box,
  Flex,
  Text,
  FlexProps,
  CheckmarkCircleIcon,
  Button,
  ButtonProps,
  color,
  Stack,
} from '@stacks/ui';

import { StackingStepView } from '../utils/use-stacking-form-step';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

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
        color={color('text-caption')}
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
        {showCompeteCheckmark && <CheckmarkCircleIcon size="16px" color={color('brand')} />}
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
            color={color('brand')}
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
  <Stack display="block" textStyle="body.large" mt="tight" spacing="base">
    {children}
  </Stack>
);

export const StackingStepAction: ForwardRefExoticComponentWithAs<
  ButtonProps,
  'button'
> = forwardRefWithAs(({ children, ...props }, ref) => (
  <Button size="md" mt="loose" ref={ref} {...props}>
    {children}
  </Button>
));
