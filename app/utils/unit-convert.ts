import BN from 'bn.js';
import BigNumber from 'bignumber.js';

function parseNumber(num: string | number | BN | BigNumber) {
  if (BigNumber.isBigNumber(num)) return num;
  if (BN.isBN(num)) return new BigNumber(num.toString());
  return new BigNumber(num);
}

export function microStxToStx(microStx: string | number | BN | BigNumber): BigNumber {
  const amount = parseNumber(microStx);
  if (!amount.isInteger()) throw new Error('Micro STX can only be represented as integers');
  return amount.dividedBy(10 ** 6);
}

export function stxToMicroStx(microStx: string | number | BN | BigNumber) {
  const amount = parseNumber(microStx);
  return amount.multipliedBy(1000000);
}

export function toHumanReadableStx(microStx: string | number | BN | BigNumber): string {
  const amount = microStxToStx(microStx);
  return amount.toFormat() + ' STX';
}
