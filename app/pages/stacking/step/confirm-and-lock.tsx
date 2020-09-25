import React, { FC } from 'react';

import {
  StackingStep,
  StackingStepAction,
  StackingStepDescription,
} from '../components/stacking-form-step';
import { StackingTerms } from '../components/stacking-terms';

interface ConfirmAndLockStepProps {
  id: string;
  formComplete: boolean;
  step?: number;
  onConfirmAndLock(): void;
}

export const ConfirmAndLockStep: FC<ConfirmAndLockStepProps> = props => {
  const { step, id, formComplete, onConfirmAndLock } = props;

  return (
    <StackingStep title={id} step={step} isComplete={false} mb="300px">
      <StackingStepDescription>
        When you confirm, your STX will be locked in your wallet.
        <br />
        Please keep in mind that:
      </StackingStepDescription>
      <StackingTerms />
      <StackingStepAction onClick={onConfirmAndLock} isDisabled={!formComplete}>
        Confirm and lock
      </StackingStepAction>
    </StackingStep>
  );
};
