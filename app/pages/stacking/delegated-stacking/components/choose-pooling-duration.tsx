import React, { FC } from 'react';
import { useField } from 'formik';
import { Stack } from '@stacks/ui';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';

import {
  StackingStep as Step,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { DurationSelectItem } from './duration-select-item';
import { DurationCyclesForm } from './duration-cycles-form';
import { LimitedStackingIcon } from './limited-stacking-icon';
import { IndefiniteStackingIcon } from './indefinite-stacking-icon';
import { OneCycleDescriptor } from '../../components/one-cycle-descriptor';

export const ChoosePoolingDurationField: FC = () => {
  const [durationTypeField, durationMeta, durationTypeHelpers] = useField('delegationType');
  const [cyclesField, _meta, durationLengthHelpers] = useField('cycles');

  return (
    <Step title="Duration">
      <Description>
        Choose whether you want to pool with a limited duration, or give the pool indefinite
        permission. If you set a limit, make sure you don’t set it lower than the number of cycles
        your pool intends to stack.
      </Description>

      <Stack spacing="base" mt="extra-loose">
        <DurationSelectItem
          title="Limited"
          delegationType="limited"
          icon={<LimitedStackingIcon cycles={cyclesField.value || 1} />}
          activeDelegationType={durationTypeField.value}
          onChange={val => durationTypeHelpers.setValue(val)}
        >
          Set a limit between 1 and 12 cycles for how long the pool can stack on your behalf. The
          pool will only be able to stack your STX up to that limit.
          {durationTypeField.value === 'limited' && (
            <DurationCyclesForm
              duration={cyclesField.value}
              onUpdate={val => durationLengthHelpers.setValue(val)}
            />
          )}
        </DurationSelectItem>
        <DurationSelectItem
          title="Indefinite"
          icon={<IndefiniteStackingIcon />}
          delegationType="indefinite"
          activeDelegationType={durationTypeField.value}
          onChange={val => durationTypeHelpers.setValue(val)}
        >
          The pool has indefinite permission to lock your STX for up to 12 cycles at a time. Revoke
          manually at any time to prevent further locks.
        </DurationSelectItem>
      </Stack>
      <OneCycleDescriptor mt="loose" />
      {durationMeta.touched && durationMeta.error && (
        <ErrorLabel mt="base-loose">
          <ErrorText>{durationMeta.error}</ErrorText>
        </ErrorLabel>
      )}
    </Step>
  );
};
