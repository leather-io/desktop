import BN from 'bn.js';
import BigNumber from 'bignumber.js';

export function microStxToStx(microStx: string | number | BN): BigNumber {
  const parsedAmount = BN.isBN(microStx) ? microStx.toString() : String(microStx);
  const amount = new BigNumber(parsedAmount);
  if (!amount.isInteger()) throw new Error('Micro STX can only be represented as integers');
  return amount.dividedBy(10 ** 6);
}

export function stxToMicroStx(microStx: string | number | BN) {
  const parsedAmount = BN.isBN(microStx) ? microStx.toString() : String(microStx);
  const amount = new BigNumber(parsedAmount);
  return amount.multipliedBy(1000000);
}

export function humanReadableStx(microStx: string | number | BN): string {
  const amount = microStxToStx(microStx);
  return amount.toFormat() + ' STX';
}
