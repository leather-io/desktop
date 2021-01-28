import React, { FC } from 'react';

import { Stepper } from '@components/stepper';
import { MAX_STACKING_CYCLES, MIN_STACKING_CYCLES } from '@constants/index';

import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';

interface ChooseCycleStepProps extends StackingStepBaseProps {
  cycles: number;
  onEdit(): void;
  onComplete(cycle: number): void;
  onUpdate(cycle: number): void;
}

export const ChooseCycleStep: FC<ChooseCycleStepProps> = props => {
  const { isComplete, state, step, cycles, title, onUpdate, onEdit, onComplete } = props;
  const value = `${cycles} cycle${cycles !== 1 ? 's' : ''} selected`;
  return (
    <Step
      step={step}
      title={title}
      value={value}
      state={state}
      isComplete={isComplete}
      onEdit={onEdit}
    >
      <Description>
        Choose the amount of cycles to lock your STX. One cycle typically lasts between 6 and 8
        days, depending on the Bitcoin block time. At the end of each cycle, you'll have the chance
        to earn bitcoin.
      </Description>
      <Stepper
        mt="loose"
        amount={cycles}
        onIncrement={cycle => {
          if (cycle > MAX_STACKING_CYCLES) return;
          onUpdate(cycle);
        }}
        onDecrement={cycle => {
          if (cycle < MIN_STACKING_CYCLES) return;
          onUpdate(cycle);
        }}
      />
      <Action onClick={() => onComplete(cycles)}>Continue</Action>
    </Step>
  );
};
