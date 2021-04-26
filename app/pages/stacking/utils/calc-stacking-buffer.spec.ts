import { BigNumber } from 'bignumber.js';
import { calculateRewardSlots, calculateStackingBuffer } from './calc-stacking-buffer';
import { stxToMicroStx } from '../../../utils/unit-convert';

const minStackingAmount = stxToMicroStx(100_000);

describe(calculateRewardSlots.name, () => {
  it('calculates a zero number of slots correctly', () => {
    expect(calculateRewardSlots(stxToMicroStx(0), minStackingAmount).toNumber()).toEqual(0);
    expect(calculateRewardSlots(stxToMicroStx(99_999), minStackingAmount).toNumber()).toEqual(0);
  });

  it('calculates the amount of slots accurately for a single slot', () => {
    expect(calculateRewardSlots(stxToMicroStx(100_000), minStackingAmount).toNumber()).toEqual(1);
    expect(calculateRewardSlots(stxToMicroStx(100_001), minStackingAmount).toNumber()).toEqual(1);
    expect(calculateRewardSlots(stxToMicroStx(199_999), minStackingAmount).toNumber()).toEqual(1);
  });

  it('calculates the amount of slots accurately for two slots', () => {
    expect(calculateRewardSlots(stxToMicroStx(200_000), minStackingAmount).toNumber()).toEqual(2);
    expect(calculateRewardSlots(stxToMicroStx(250_999), minStackingAmount).toNumber()).toEqual(2);
    expect(calculateRewardSlots(stxToMicroStx(299_999), minStackingAmount).toNumber()).toEqual(2);
  });
});

describe(calculateStackingBuffer.name, () => {
  it('calculates zero if less than 10k STX', () => {
    expect(calculateStackingBuffer(stxToMicroStx(100_000), minStackingAmount).toNumber()).toEqual(
      0
    );
    expect(calculateStackingBuffer(stxToMicroStx(100_999), minStackingAmount).toNumber()).toEqual(
      0
    );
  });
  it('calculates 1 if more than 10k STX, less than 20k', () => {
    expect(calculateStackingBuffer(stxToMicroStx(110_000), minStackingAmount).toNumber()).toEqual(
      stxToMicroStx(10_000).toNumber()
    );
    expect(calculateStackingBuffer(stxToMicroStx(210_000), minStackingAmount).toNumber()).toEqual(
      stxToMicroStx(10_000).toNumber()
    );
  });
});
