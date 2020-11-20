import BigNumber from 'bignumber.js';

export function validateDecimalPrecision(allowedPrecision: number) {
  return (value: any) => {
    if (value === null || value === undefined) return false;
    // Explicit base ensures BigNumber doesn't use exponential notation
    const decimals = new BigNumber(value).toString(10).split('.')[1];
    return decimals === undefined || decimals.length <= allowedPrecision;
  };
}
