import React, { FC, useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import { Box, Button, color, Input, Stack, Text } from '@stacks/ui';
import { useField } from 'formik';
import { useSelector } from 'react-redux';
import { selectPoxInfo } from '@store/stacking';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { microStxToStx, stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { ExternalLink } from '@components/external-link';

import { useBalance } from '@hooks/use-balance';
import {
  STACKING_CONTRACT_CALL_TX_BYTES,
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

interface ChooseAmountFieldProps extends StackingStepBaseProps {
  minimumAmountToStack: number;
}

const BigNumberFloorRound = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

export const ChooseDirectStackingAmountField: FC<ChooseAmountFieldProps> = props => {
  const { minimumAmountToStack } = props;

  const [field, meta, helpers] = useField('amount');

  const { availableBalance } = useBalance();
  const poxInfo = useSelector(selectPoxInfo);

  const ustxAmount = stxToMicroStx(field.value || 0);

  const showStackingWarningCard = ustxAmount.isGreaterThanOrEqualTo(minimumAmountToStack);

  const setMax = useCallback(() => {
    const updatedAmount = new BigNumberFloorRound(
      microStxToStx(availableBalance.minus(STACKING_CONTRACT_CALL_TX_BYTES).toString())
    ).decimalPlaces(0);
    void helpers.setValue(updatedAmount.toString());
  }, [availableBalance, helpers]);

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
    <Step title="Choose amount">
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

      <Box position="relative" maxWidth="400px">
        <Input id="stxAmount" placeholder="Amount of STX to Stack" mt="loose" {...field} />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
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
              {toHumanReadableStx(floorRoundedStxBuffer || 0)} buffer at the current minimum.
              However, that minimum is subject to change and there is no guarantee you will get any
              reward slots.
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
              reward slots should the minimum increase. If you can’t add a buffer, consider Stacking
              in a pool instead.
              <Button
                variant="link"
                type="button"
                display="block"
                mt="tight"
                onClick={() => helpers.setValue(new BigNumber(field.value).plus(10000).toString())}
              >
                Add 10,000 STX buffer
              </Button>
            </Box>
          )}
        </>
      )}
    </Step>
  );
};
