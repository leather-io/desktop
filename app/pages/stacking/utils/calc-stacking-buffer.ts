import { BigNumber } from 'bignumber.js';

import { stxToMicroStx } from '@utils/unit-convert';

const BigNumberFloorRound = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

export function calculateRewardSlots(ustxAmount: BigNumber, minRequireToStack: BigNumber) {
  return new BigNumberFloorRound(ustxAmount).dividedBy(minRequireToStack).integerValue();
}

export function calculateStackingBuffer(ustxAmount: BigNumber, minRequireToStack: BigNumber) {
  const numberOfRewardSlots = calculateRewardSlots(ustxAmount, minRequireToStack);

  const stxBuffer = numberOfRewardSlots
    .multipliedBy(minRequireToStack)
    .minus(ustxAmount)
    .absoluteValue();

  const stackingIncrements = stxToMicroStx(10_000);

  return new BigNumberFloorRound(stxBuffer)
    .dividedBy(stackingIncrements)
    .integerValue()
    .multipliedBy(stackingIncrements);
}
