import React, { FC } from 'react';
import { Box, BoxProps, color, Flex, FlexProps, Text } from '@stacks/ui';

import { decrement, increment } from '@utils/mutate-numbers';
import { DecrementIcon } from './icons/decrement';
import { IncrementIcon } from './icons/increment';

interface StepperProps extends BoxProps {
  amount: number;
  onIncrement(amount: number): void;
  onDecrement(amount: number): void;
}

const border = `1px solid ${color('border')}`;

const ChangeStepButton: FC<FlexProps> = ({ children, ...props }) => (
  <Flex
    as="button"
    alignItems="center"
    justifyContent="center"
    width="52px"
    height="48px"
    border={border}
    outline={0}
    zIndex={1}
    _focus={{
      borderColor: '#C5CCFF',
      boxShadow: '0 0 0 3px rgba(170,179,255,0.75)',
    }}
    {...props}
  >
    {children}
  </Flex>
);

export const Stepper: FC<StepperProps> = props => {
  const { amount, onIncrement, onDecrement, ...rest } = props;
  return (
    <Box {...rest}>
      <Flex>
        <ChangeStepButton onClick={() => onDecrement(decrement(amount))} borderRadius="6px 0 0 6px">
          <DecrementIcon />
        </ChangeStepButton>
        <Flex
          borderTop={border}
          borderBottom={border}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minWidth="100px"
        >
          <Text textStyle="body.small" mb="3px" mx="base">
            {amount} cycle{amount !== 1 && 's'}
          </Text>
        </Flex>
        <ChangeStepButton onClick={() => onIncrement(increment(amount))} borderRadius="0 6px 6px 0">
          <IncrementIcon />
        </ChangeStepButton>
      </Flex>
    </Box>
  );
};
