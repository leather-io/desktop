import React, { FC } from 'react';

import {
  StackingStep,
  StackingStepAction,
  StackingStepDescription,
} from '../../components/stacking-form-step';
import { StackingTerms } from '../../components/stacking-terms';

interface ConfirmAndLockStepProps {
  title: string;
  formComplete: boolean;
  step?: number;
  timeUntilNextCycle: string;
  estimatedDuration: string;
  onConfirmAndLock(): void;
}

export const ConfirmAndLockStep: FC<ConfirmAndLockStepProps> = props => {
  const {
    step,
    title,
    formComplete,
    timeUntilNextCycle,
    estimatedDuration,
    onConfirmAndLock,
  } = props;

  return (
    <StackingStep title={title} step={step} isComplete={false} state="open" mb="300px">
      <StackingStepDescription>
        When you confirm, your STX will be locked in your wallet.
        <br />
        Please keep in mind that:
      </StackingStepDescription>
      <StackingTerms
        timeUntilNextCycle={timeUntilNextCycle}
        estimatedDuration={estimatedDuration}
      />
      <StackingStepAction onClick={onConfirmAndLock} isDisabled={!formComplete}>
        Confirm and lock
      </StackingStepAction>
    </StackingStep>
  );
};
