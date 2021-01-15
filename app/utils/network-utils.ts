export function isTestnet() {
  return process.env.STX_NETWORK === 'testnet';
}

export function isMainnet() {
  return process.env.STX_NETWORK === 'mainnet';
}

export function whenNetwork<T>({ mainnet, testnet }: { mainnet: T; testnet: T }): T {
  if (isMainnet()) return mainnet;
  if (isTestnet()) return testnet;
  throw new Error('`NETWORK` is set to neither `mainnet` or `testnet`');
}
