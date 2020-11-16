import React, { FC } from 'react';

import { Stepper } from '@components/stepper';
import { MAX_STACKING_CYCLES, MIN_STACKING_CYCLES } from '@constants/index';

import {
  StackingStep,
  StackingStepAction,
  StackingStepDescription,
} from '../components/stacking-form-step';

interface ChooseCycleStepProps {
  id: string;
  step?: number;
  isComplete: boolean;
  cycles: number;
  onEdit(): void;
  onComplete(): void;
  onUpdate(cycle: number): void;
}

export const ChooseCycleStep: FC<ChooseCycleStepProps> = props => {
  const { isComplete, step, cycles, id, onUpdate, onEdit, onComplete } = props;
  const value = `${cycles} cycle${cycles !== 1 ? 's' : ''} selected`;
  return (
    <StackingStep step={step} title={id} value={value} isComplete={isComplete} onEdit={onEdit}>
      <StackingStepDescription>
        Choose the amount of cycles to lock your STX. One cycle typically lasts between 6 and 8
        days, depending on the Bitcoin block time. At the end of each cycle, you'll have the chance
        to earn Bitcoin.
      </StackingStepDescription>
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
      <StackingStepAction onClick={onComplete}>Continue</StackingStepAction>
    </StackingStep>
  );
};
