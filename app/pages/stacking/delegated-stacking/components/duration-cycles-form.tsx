import React, { FC, useState } from 'react';
import { Button, ButtonGroup, Flex, InputProps, Text } from '@blockstack/ui';

interface DurationCycleFromProps extends Omit<InputProps, 'form'> {
  duration: number;
}

export const DurationCyclesForm: FC<DurationCycleFromProps> = props => {
  const { duration } = props;
  const [cycles, setCycles] = useState(duration);
  const cycleLabels = [
    '1 cycle (~14 days)',
    '2 cycle (~28 days)',
    '3 cycle (~42 days)',
    '4 cycle (~2 months)',
    '5 cycle (~2,5 months)',
    '6 cycle (~3 months)',
    '7 cycle (~3,5 months)',
    '8 cycle (~4 months)',
    '9 cycle (~4,5 months)',
    '10 cycle (~5 months)',
    '11 cycle (~5,5 months)',
    '12 cycle (~6 months)',
  ];
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      mt="extra-loose"
      padding="8px"
      boxShadow="low"
      border="1px solid #F0F0F5"
      borderRadius="8px"
    >
      <Text alignItems="center">{cycleLabels[cycles - 1]}</Text>
      <ButtonGroup>
        <Button onClick={() => setCycles(Math.min(12, cycles + 1))}>+</Button>
        <Button onClick={() => setCycles(Math.max(1, cycles - 1))}>-</Button>
      </ButtonGroup>
    </Flex>
  );
};
