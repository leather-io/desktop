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
  value?: string;
  onEdit(): void;
  onComplete(args: { duration: number | null; delegationType: DelegationType }): void;
}

export const ChooseMembershipDurationStep: FC<ChooseMembershipDurationStepProps> = props => {
  const { isComplete, state, step, title, value, onEdit, onComplete } = props;
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
      <Description>
        Choose whether you want to pool with a limited duration, or give the pool indefinite
        permission. If you set a limit, make sure you don’t set it lower than the number of cycles
        your pool intends to stack.
      </Description>
      <form onSubmit={durationForm.handleSubmit}>
        <DurationSelect>
          <DurationSelectItem
            title="Indefinite"
            delegationType="indefinite"
            activeDelegationType={durationForm.values.delegationType}
            onChange={val => durationForm.setFieldValue('delegationType', val)}
            isFirst
          >
            The pool has indefinite permission to lock your STX for up to 12 cycles at a time.
            Revoke manually at any time to prevent further locks.
          </DurationSelectItem>
          <DurationSelectItem
            title="Limited"
            delegationType="limited"
            activeDelegationType={durationForm.values.delegationType}
            onChange={val => durationForm.setFieldValue('delegationType', val)}
          >
            The pool will have permission to lock your STX for this number of cycles. It is not
            possible to lock your STX longer than the specified period.
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
