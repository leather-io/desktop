import { calculateUntilBurnHeightBlockFromCycles } from './calculate-burn-height';

describe(calculateUntilBurnHeightBlockFromCycles.name, () => {
  const genesisBurnBlockHeight = 666050;

  describe('testnet scenarios', () => {
    const rewardCycleLength = 50;

    test('it calculates correctly with one cycle', () => {
      const result = calculateUntilBurnHeightBlockFromCycles({
        genesisBurnBlockHeight,
        cycles: 1,
        currentCycleId: 1,
        rewardCycleLength,
      });
      expect(result).toEqual(666200);
      expect((result - genesisBurnBlockHeight) % rewardCycleLength).toEqual(0);
    });

    test('it calculates correctly with two cycles', () => {
      const result = calculateUntilBurnHeightBlockFromCycles({
        genesisBurnBlockHeight,
        cycles: 2,
        currentCycleId: 1,
        rewardCycleLength,
      });
      expect(result).toEqual(666250);
      expect((result - genesisBurnBlockHeight) % rewardCycleLength).toEqual(0);
    });
  });

  describe('mainnet scenarios', () => {
    const rewardCycleLength = 2100;

    test('it calculates correctly with three cycles, one block into current cycle', () => {
      const result = calculateUntilBurnHeightBlockFromCycles({
        genesisBurnBlockHeight,
        rewardCycleLength,
        cycles: 3,
        currentCycleId: 1,
      });
      expect(result).toEqual(676550);
      expect((result - genesisBurnBlockHeight) % rewardCycleLength).toEqual(0);
    });

    test('it calculates correctly with eight cycles', () => {
      const result = calculateUntilBurnHeightBlockFromCycles({
        genesisBurnBlockHeight,
        rewardCycleLength,
        cycles: 8,
        currentCycleId: 1,
      });
      expect(result).toEqual(687050);
      expect((result - genesisBurnBlockHeight) % rewardCycleLength).toEqual(0);
    });

    test('it calculates correctly with twelve cycles', () => {
      const result = calculateUntilBurnHeightBlockFromCycles({
        genesisBurnBlockHeight,
        rewardCycleLength,
        cycles: 12,
        currentCycleId: 10,
      });
      expect(result).toEqual(714350);
      expect((result - genesisBurnBlockHeight) % rewardCycleLength).toEqual(0);
    });
  });
});
