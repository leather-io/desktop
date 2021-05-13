import React, { FC, useState } from 'react';

import { StackingStep, StackingStepAction } from '../../components/stacking-form-step';
import { StackingUserConfirm } from '../../components/stacking-user-confirm';
import { DirectStackingTerms } from './direct-stacking-terms';

interface ConfirmAndLockStepProps {
  timeUntilNextCycle: string;
  estimatedDuration: string;
  onConfirmAndLock(): void;
}

export const ConfirmAndStackStep: FC<ConfirmAndLockStepProps> = props => {
  const { onConfirmAndLock } = props;
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);

  return (
    <StackingStep title="Confirm and stack" mb="300px">
      <DirectStackingTerms mt="loose" />
      <StackingUserConfirm
        onChange={useConfirmed => setHasUserConfirmed(useConfirmed)}
        mt="extra-loose"
      />
      <StackingStepAction onClick={onConfirmAndLock} isDisabled={!hasUserConfirmed} type="submit">
        Confirm and start stacking
      </StackingStepAction>
    </StackingStep>
  );
};
