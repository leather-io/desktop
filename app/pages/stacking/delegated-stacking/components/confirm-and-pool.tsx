import { StackingStep, StackingStepAction } from '../../components/stacking-form-step';
import { StackingUserConfirm } from '../../components/stacking-user-confirm';
import { DelegatedStackingTerms } from './delegated-stacking-terms';
import React, { FC, useState } from 'react';

interface ConfirmAndPoolActionProps {
  onConfirmAndPool(): void;
}
export const ConfirmAndPoolAction: FC<ConfirmAndPoolActionProps> = props => {
  const { onConfirmAndPool } = props;

  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);

  return (
    <StackingStep title="Confirm and pool" mb="300px">
      <DelegatedStackingTerms mt="loose" />
      <StackingUserConfirm
        onChange={useConfirmed => setHasUserConfirmed(useConfirmed)}
        mt="extra-loose"
      />
      <StackingStepAction type="button" onClick={onConfirmAndPool} isDisabled={!hasUserConfirmed}>
        Confirm and start pooling
      </StackingStepAction>
    </StackingStep>
  );
};
