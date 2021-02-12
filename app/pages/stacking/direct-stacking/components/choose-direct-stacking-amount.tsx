import React, { FC, useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import { Box, Button, Input } from '@blockstack/ui';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { validateDecimalPrecision } from '@utils/form/validate-decimals';
import { microStxToStx, stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { stxAmountSchema } from '@utils/validators/stx-amount-validator';
import { useBalance } from '@hooks/use-balance';

import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepAction as Action,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';

const CONTRACT_CALL_FEE = 260;

interface ChooseAmountStepProps extends StackingStepBaseProps {
  description: string;
  minimumAmountToStack: number;
  value: BigNumber | null;
  onEdit(): void;
  onComplete(amount: BigNumber): void;
}

const BigNumberFloorRound = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

export const ChooseDirectStackingAmountStep: FC<ChooseAmountStepProps> = props => {
  const {
    title,
    description,
    isComplete,
    state,
    step,
    value,
    minimumAmountToStack,
    onEdit,
    onComplete,
  } = props;

  const { availableBalance, availableBalanceValidator } = useBalance();

  const stxAmountForm = useFormik({
    initialValues: { stxAmount: '' },
    validationSchema: yup.object().shape({
      stxAmount: stxAmountSchema()
        .test(availableBalanceValidator())
        .test('test-precision', 'You cannot stack with a precision of less than 1 STX', value => {
          // If `undefined`, throws `required` error
          if (value === undefined) return true;
          return validateDecimalPrecision(0)(value);
        })
        .test({
          name: 'test-fee-margin',
          message: 'You must stack less than your entire balance to allow for the transaction fee',
          test: value => {
            if (value === null || value === undefined) return false;
            const uStxInput = stxToMicroStx(value);
            return !uStxInput.isGreaterThan(availableBalance.minus(CONTRACT_CALL_FEE));
          },
        })
        .test({
          name: 'test-min-utx',
          message: `You must stack with at least ${toHumanReadableStx(minimumAmountToStack)} `,
          test: value => {
            if (value === null || value === undefined) return false;
            const uStxInput = stxToMicroStx(value);
            return new BigNumber(minimumAmountToStack).isLessThanOrEqualTo(uStxInput);
          },
        }),
    }),
    onSubmit: ({ stxAmount }) => onComplete(stxToMicroStx(stxAmount)),
  });

  const setMax = useCallback(() => {
    const updatedAmount = new BigNumberFloorRound(
      microStxToStx(availableBalance.minus(CONTRACT_CALL_FEE).toString())
    ).decimalPlaces(0);
    void stxAmountForm.setValues({ stxAmount: updatedAmount.toString() });
  }, [availableBalance, stxAmountForm]);

  const currentValue =
    value === null ? toHumanReadableStx(0) : toHumanReadableStx(value.toString());

  return (
    <Step
      title={title}
      step={step}
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
        <Action type="submit">Continue</Action>
      </form>
    </Step>
  );
};
