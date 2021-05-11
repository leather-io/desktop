import React, { FC, useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import { Box, Button, color, Input, Stack, Text } from '@stacks/ui';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { selectPoxInfo } from '@store/stacking';
import * as yup from 'yup';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { validateDecimalPrecision } from '@utils/form/validate-decimals';
import { microStxToStx, stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { ExternalLink } from '@components/external-link';
import { stxAmountSchema } from '@utils/validators/stx-amount-validator';
import { useBalance } from '@hooks/use-balance';
import {
  STACKING_CONTRACT_CALL_FEE,
  STACKING_LEARN_MORE_URL,
  STACKING_MINIMIUM_FOR_NEXT_CYCLE_URL,
} from '@constants/index';

import { StackingStepBaseProps } from '../../utils/abstract-stacking-step';
import {
  StackingStep as Step,
  StackingStepDescription as Description,
} from '../../components/stacking-form-step';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import { calculateRewardSlots, calculateStackingBuffer } from '../../utils/calc-stacking-buffer';

interface ChooseAmountStepProps extends StackingStepBaseProps {
  minimumAmountToStack: number;
  value: BigNumber | null;
  onEdit(): void;
  onComplete(amount: BigNumber): void;
}

const BigNumberFloorRound = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

export const ChooseDirectStackingAmountStep: FC<ChooseAmountStepProps> = props => {
  const { title, isComplete, step, value, minimumAmountToStack, onEdit, onComplete } = props;

  const { availableBalance, availableBalanceValidator } = useBalance();
  const poxInfo = useSelector(selectPoxInfo);

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
            return !uStxInput.isGreaterThan(availableBalance.minus(STACKING_CONTRACT_CALL_FEE));
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

  const ustxAmount = stxToMicroStx(stxAmountForm.values.stxAmount || 0);

  const showStackingWarningCard = ustxAmount.isGreaterThanOrEqualTo(minimumAmountToStack);

  const setMax = useCallback(() => {
    const updatedAmount = new BigNumberFloorRound(
      microStxToStx(availableBalance.minus(STACKING_CONTRACT_CALL_FEE).toString())
    ).decimalPlaces(0);
    void stxAmountForm.setValues({ stxAmount: updatedAmount.toString() });
  }, [availableBalance, stxAmountForm]);

  const currentValue =
    value === null ? toHumanReadableStx(0) : toHumanReadableStx(value.toString());

  if (poxInfo === null) return null;

  const numberOfRewardSlots = calculateRewardSlots(
    ustxAmount,
    new BigNumber(poxInfo.min_amount_ustx)
  ).integerValue();

  const floorRoundedStxBuffer = calculateStackingBuffer(
    ustxAmount,
    new BigNumber(poxInfo.min_amount_ustx)
  );

  return (
    <Step
      title={title}
      step={step}
      value={currentValue.toString()}
      isComplete={isComplete}
      onEdit={onEdit}
    >
      <Description>
        <Stack alignItems="flex-start" spacing="base">
          <Text>
            You’ll be eligible for one reward slot for every multiple of the minimum you stack.
          </Text>
          <Text>
            The estimated minimum per slot can change by multiples of 10,000 every cycle, so you may
            want to add a buffer to increase your chance of keeping the same number of slots.
          </Text>
          <ExternalLink href={STACKING_LEARN_MORE_URL}>
            Learn how to choose the right amount
          </ExternalLink>
          <ExternalLink href={STACKING_MINIMIUM_FOR_NEXT_CYCLE_URL}>
            View the minimum for next cycle
          </ExternalLink>
        </Stack>
      </Description>
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
        {showStackingWarningCard && (
          <>
            <Stack textStyle="body.small" color={color('text-caption')} spacing="base" mt="base">
              <Text>
                This entered amount would get you {numberOfRewardSlots.toString()} reward slot
                {numberOfRewardSlots.toNumber() === 1 ? '' : 's'} with a{' '}
                {toHumanReadableStx((floorRoundedStxBuffer || 0).toString())} buffer at the current
                minimum. However, that minimum is subject to change and there is no guarantee you
                will get any reward slots.
              </Text>
              <Text>
                You <strong>will not</strong> be able to add more STX for locking from this address
                until all locked STX unlock at the end of the duration set below.
              </Text>
            </Stack>
            {floorRoundedStxBuffer.isEqualTo(0) && (
              <Box
                textStyle="body.small"
                color={color('text-body')}
                border="1px solid"
                p="loose"
                mt="base"
                borderRadius="6px"
                borderColor={color('border')}
                {...pseudoBorderLeft('feedback-alert')}
              >
                Add a buffer for a higher chance (though no guarantee) of keeping the same number of
                reward slots should the minimum increase. If you can’t add a buffer, consider
                Stacking in a pool instead.
                <Button
                  variant="link"
                  type="button"
                  display="block"
                  mt="tight"
                  onClick={() =>
                    stxAmountForm.setFieldValue(
                      'stxAmount',
                      new BigNumber(stxAmountForm.values.stxAmount).plus(10000).toString()
                    )
                  }
                >
                  Add 10,000 STX buffer
                </Button>
              </Box>
            )}
          </>
        )}
      </form>
    </Step>
  );
};
