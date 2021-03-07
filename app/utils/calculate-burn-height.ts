import BigNumber from 'bignumber.js';

interface CalcBurnHeightBlockFromCyclesArgs {
  cycles: number;
  rewardCycleLength: number;
  currentCycleId: number;
  genesisBurnBlockHeight: number;
}
export function calculateUntilBurnHeightBlockFromCycles(args: CalcBurnHeightBlockFromCyclesArgs) {
  const { cycles, rewardCycleLength, genesisBurnBlockHeight, currentCycleId } = args;
  return new BigNumber(genesisBurnBlockHeight)
    .plus(new BigNumber(currentCycleId).plus(1).multipliedBy(rewardCycleLength))
    .plus(new BigNumber(cycles).multipliedBy(rewardCycleLength))
    .toNumber();
}
