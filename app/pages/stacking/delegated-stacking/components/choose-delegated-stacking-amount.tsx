import React, { FC } from 'react';
import { BigNumber } from 'bignumber.js';
import { Box, Input } from '@blockstack/ui';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  MAX_DELEGATED_STACKING_AMOUNT_USTX,
  MIN_DELEGATED_STACKING_AMOUNT_USTX,
} from '@constants/index';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { stxAmountSchema } from '@utils/validators/stx-amount-validator';

import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';

interface ChooseAmountStepProps extends StackingStepBaseProps {
  description: string;
  value: BigNumber | null;
  onEdit(): void;
  onComplete(amount: BigNumber): void;
}

export const ChooseDelegatedStackingAmountStep: FC<ChooseAmountStepProps> = props => {
  const { title, description, isComplete, state, step, value, onEdit, onComplete } = props;

  const stxAmountForm = useFormik({
    initialValues: { stxAmount: '' },
    validationSchema: yup.object().shape({
      stxAmount: stxAmountSchema()
        .test({
          name: 'test-min-allowed-delegated-stacking',
          message: `You must delegate at least ${toHumanReadableStx(
            MIN_DELEGATED_STACKING_AMOUNT_USTX
          )}`,
          test: (value: any) => {
            if (value === null || value === undefined) return false;
            const enteredAmount = stxToMicroStx(value);
            return enteredAmount.isGreaterThanOrEqualTo(MIN_DELEGATED_STACKING_AMOUNT_USTX);
          },
        })
        .test({
          name: 'test-max-allowed-delegated-stacking',
          message: `You cannot delegate more than ${toHumanReadableStx(
            MAX_DELEGATED_STACKING_AMOUNT_USTX.toString()
          )}`,
          test: (value: any) => {
            if (value === null || value === undefined) return false;
            const enteredAmount = stxToMicroStx(value);
            return enteredAmount.isLessThanOrEqualTo(MAX_DELEGATED_STACKING_AMOUNT_USTX);
          },
        }),
    }),
    onSubmit: ({ stxAmount }) => onComplete(stxToMicroStx(stxAmount)),
  });

  const currentValue =
    value === null ? toHumanReadableStx(0) : toHumanReadableStx(value.toString());

  return (
    <Step
      step={step}
      title={title}
      value={currentValue.toString()}
      state={state}
      isComplete={isComplete}
      onEdit={onEdit}
    >
      <Description>{description}</Description>
      <form onSubmit={stxAmountForm.handleSubmit}>
        <Box position="relative" maxWidth="400px">
          <Input
            id="stxAmount"
            name="stxAmount"
            onChange={stxAmountForm.handleChange}
            value={stxAmountForm.values.stxAmount}
            placeholder="Amount of STX to Stack"
            mt="loose"
          />
          {stxAmountForm.touched.stxAmount && stxAmountForm.errors.stxAmount && (
            <ErrorLabel>
              <ErrorText>{stxAmountForm.errors.stxAmount}</ErrorText>
            </ErrorLabel>
          )}
        </Box>
        <Action type="submit">Continue</Action>
      </form>
    </Step>
  );
};
