import {
  StackingStep as Step,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { useBalance } from '@hooks/use-balance';
import { Box, Button, color, Input } from '@stacks/ui';
import { microStxToStx, toHumanReadableStx } from '@utils/unit-convert';
import { useField } from 'formik';
import React, { FC, useRef } from 'react';

export const ChoosePoolingAmountField: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [field, meta, helpers] = useField('amount');

  const { availableBalance } = useBalance();

  return (
    <Step title="Amount">
      <Description>Choose how much you’ll pool. Your pool may require a minimum.</Description>
      <Box position="relative" maxWidth="400px">
        <Input
          id="stxAmount"
          mt="loose"
          placeholder="Amount of STX to Stack"
          ref={inputRef}
          {...field}
        />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Box>
      <Box textStyle="body.small" color={color('text-caption')} mt="base-tight">
        Available balance:{' '}
        <Button
          variant="link"
          type="button"
          onClick={() => helpers.setValue(microStxToStx(availableBalance))}
        >
          {toHumanReadableStx(availableBalance)}
        </Button>
      </Box>
    </Step>
  );
};
