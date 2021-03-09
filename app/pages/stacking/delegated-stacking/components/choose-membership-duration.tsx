import React, { FC, useState } from 'react';
import { useFormik } from 'formik';

import { DelegationType } from '@models';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { DurationSelectItem } from './duration-select-item';
import { DurationSelect } from './duration-select';
import { DurationCyclesForm } from './duration-cycles-form';

interface DelegationTypeInitialValues {
  delegationType: DelegationType | null;
  duration: number | null;
}

interface ChooseMembershipDurationStepProps extends StackingStepBaseProps {
  description: string;
  value?: string;
  onEdit(): void;
  onComplete(args: { duration: number | null; delegationType: DelegationType }): void;
}

export const ChooseMembershipDurationStep: FC<ChooseMembershipDurationStepProps> = props => {
  const { isComplete, description, state, step, title, value, onEdit, onComplete } = props;
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const durationForm = useFormik<DelegationTypeInitialValues>({
    initialValues: {
      delegationType: null,
      duration: 1,
    },
    validate({ delegationType }) {
      if (delegationType === null) return { delegationType: 'You must select a duration' };
      return {};
    },
    onSubmit: ({ delegationType, duration }) => {
      if (delegationType === null) return;
      setHasSubmitted(true);
      if (delegationType === 'indefinite') onComplete({ delegationType, duration: null });
      if (delegationType === 'limited') onComplete({ delegationType, duration });
    },
  });

  return (
    <Step
      title={title}
      step={step}
      state={state}
      value={value}
      isComplete={isComplete}
      onEdit={onEdit}
    >
      <Description>{description}</Description>
      <form onSubmit={durationForm.handleSubmit}>
        <DurationSelect>
          <DurationSelectItem
            title="Indefinite"
            delegationType="indefinite"
            activeDelegationType={durationForm.values.delegationType}
            onChange={val => durationForm.setFieldValue('delegationType', val)}
            isFirst
          >
            The pool can stack your STX indefinitely, up to 12 cycles at a time. Revoking will
            unlock your STX after any in-progress cycles have completed.
          </DurationSelectItem>
          <DurationSelectItem
            title="Limited"
            delegationType="limited"
            activeDelegationType={durationForm.values.delegationType}
            onChange={val => durationForm.setFieldValue('delegationType', val)}
          >
            Limit the duration the pool can stack your STX for. After this duration, your STX will
            unlock automatically.
            {durationForm.values.delegationType === 'limited' && (
              <DurationCyclesForm
                duration={durationForm.values.duration}
                onUpdate={newDuration => durationForm.setFieldValue('duration', newDuration)}
              />
            )}
          </DurationSelectItem>
        </DurationSelect>
        {hasSubmitted && durationForm.errors.delegationType && (
          <ErrorLabel>
            <ErrorText>{durationForm.errors.delegationType}</ErrorText>
          </ErrorLabel>
        )}
        <Action type="submit">Continue</Action>
      </form>
    </Step>
  );
};
