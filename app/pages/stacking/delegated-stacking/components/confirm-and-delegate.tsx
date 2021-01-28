import React, { FC } from 'react';

import {
  StackingStep,
  StackingStepAction,
  StackingStepDescription,
} from '../../components/stacking-form-step';
import { DelegatedStackingTerms } from '../../components/delegated-stacking-terms';

interface ConfirmAndLockStepProps {
  id: string;
  formComplete: boolean;
  step?: number;
  onConfirmAndDelegate(): void;
}

export const ConfirmAndDelegateStep: FC<ConfirmAndLockStepProps> = props => {
  const { step, id, formComplete, onConfirmAndDelegate } = props;

  return (
    <StackingStep title={id} step={step} isComplete={false} state="open" mb="300px">
      <StackingStepDescription>
        When you confirm, your STX will be delegated to the STX address you’ve entered. Please keep
        in mind that:
      </StackingStepDescription>
      <DelegatedStackingTerms />
      <StackingStepAction onClick={onConfirmAndDelegate} isDisabled={!formComplete}>
        Confirm and delegate
      </StackingStepAction>
    </StackingStep>
  );
};
