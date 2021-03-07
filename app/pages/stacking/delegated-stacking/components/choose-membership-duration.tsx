import React, { FC } from 'react';

import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { DurationSelectItem } from './duration-select-item';
import { DurationSelect } from './duration-select';
import { DurationCyclesForm } from './duration-cycles-form';
import { useFormik } from 'formik';

interface ChooseMembershipDurationStepProps extends StackingStepBaseProps {
  description: string;
  value?: string;
  onEdit(): void;
  onComplete(duration: number): void;
}

export const ChooseMembershipDurationStep: FC<ChooseMembershipDurationStepProps> = props => {
  const { isComplete, description, state, step, title, value, onEdit, onComplete } = props;

  const durationForm = useFormik({
    initialValues: { duration: -1 },
    onSubmit: ({ duration }) => onComplete(duration),
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
            durationType={-1}
            duration={-1}
            activeDuration={durationForm.values.duration}
            index={0}
            onChange={() => (durationForm.values.duration = -1)}
          >
            The pool can stack your STX indefinitely, up to 12 cycles at a time. Revoking will
            unlock your STX after any in-progress cycles have completed.
          </DurationSelectItem>
          <DurationSelectItem
            title="Limited"
            durationType={1}
            duration={1}
            activeDuration={durationForm.values.duration}
            index={1}
            onChange={newDuration => (durationForm.values.duration = newDuration)}
          >
            Limit the duration the pool can stack your STX for. After this duration, your STX will
            unlock automatically.
            <DurationCyclesForm
              duration={1}
              onChange={newDuration => (durationForm.values.duration = newDuration)}
            />
          </DurationSelectItem>
        </DurationSelect>
        <Action type="submit">Continue</Action>
      </form>
    </Step>
  );
};
