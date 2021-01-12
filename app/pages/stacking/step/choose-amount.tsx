import React, { FC, useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import { Box, Button, Input } from '@blockstack/ui';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  StackingStep,
  StackingStepAction,
  StackingStepDescription,
} from '../components/stacking-form-step';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { validateDecimalPrecision } from '@utils/form/validate-decimals';
import { microStxToStx, stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { StackingStepState } from '../stacking';

interface ChooseAmountStepProps {
  id: string;
  balance: BigNumber;
  step?: number;
  state: StackingStepState;
  minimumAmountToStack: number;
  isComplete: boolean;
  value: BigNumber | null;
  onEdit(): void;
  onComplete(amount: BigNumber): void;
}

const BigNumberFloorRound = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

export const ChooseAmountStep: FC<ChooseAmountStepProps> = props => {
  const {
    isComplete,
    state,
    step,
    id,
    value,
    balance,
    minimumAmountToStack,
    onEdit,
    onComplete,
  } = props;

  const stxAmountForm = useFormik({
    initialValues: { stxAmount: '' },
    validationSchema: yup.object().shape({
      stxAmount: yup
        .number()
        .required('Enter an amount of STX')
        .positive('You cannot Stack a negative quantity of STX')
        .typeError('STX amount must be a number')
        .test('test-precision', 'You cannot stack with a precision of less than 1 STX', value => {
          // If `undefined`, throws `required` error
          if (value === undefined) return true;
          return validateDecimalPrecision(0)(value);
        })
        .test('test-balance', 'Amount must be lower than balance', value => {
          if (value === null || value === undefined) return false;
          const enteredAmount = stxToMicroStx(value);
          return enteredAmount.isLessThanOrEqualTo(balance);
        })
        .test(
          'test-min-utx',
          `You must stack with at least ${toHumanReadableStx(minimumAmountToStack)} `,
          value => {
            if (value === null || value === undefined) return false;
            const uStxInput = stxToMicroStx(value);
            return new BigNumber(minimumAmountToStack).isLessThanOrEqualTo(uStxInput);
          }
        ),
    }),
    onSubmit: ({ stxAmount }) => onComplete(stxToMicroStx(stxAmount)),
  });

  const setMax = useCallback(() => {
    const updatedAmount = new BigNumberFloorRound(microStxToStx(balance.toString())).decimalPlaces(
      0
    );
    void stxAmountForm.setValues({ stxAmount: updatedAmount.toString() });
  }, [balance, stxAmountForm]);

  const currentValue =
    value === null ? toHumanReadableStx(0) : toHumanReadableStx(value.toString());

  return (
    <StackingStep
      step={step}
      title={id}
      value={currentValue.toString()}
      state={state}
      isComplete={isComplete}
      onEdit={onEdit}
    >
      <StackingStepDescription>
        Choose how much of your STX you’d like to lock. The BTC you earn will be proportional to the
        amount locked.
      </StackingStepDescription>
      <form onSubmit={stxAmountForm.handleSubmit}>
        <Box position="relative" maxWidth="400px">
          <Input
            id="stxAmount"
            name="stxAmount"
            onChange={stxAmountForm.handleChange}
            value={stxAmountForm.values.stxAmount}
            placeholder="Amount of STX to Stack"
            title="A small amount of STX are withheld to cover the transaction fee"
            mt="loose"
          />
          {stxAmountForm.touched.stxAmount && stxAmountForm.errors.stxAmount && (
            <ErrorLabel>
              <ErrorText>{stxAmountForm.errors.stxAmount}</ErrorText>
            </ErrorLabel>
          )}
          <Button
            type="button"
            mode="tertiary"
            size="sm"
            height="28px"
            right="12px"
            top="10px"
            style={{ position: 'absolute' }}
            width="80px"
            onClick={setMax}
          >
            Stack max
          </Button>
        </Box>
        <StackingStepAction type="submit">Continue</StackingStepAction>
      </form>
    </StackingStep>
  );
};
