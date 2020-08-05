export const MNEMONIC_ENTROPY = 256;

type Environments = 'development' | 'testing' | 'production';

export const ENV = (process.env.NODE_ENV ?? 'production') as Environments;

export const BUY_STX_URL = 'https://coinmarketcap.com/currencies/blockstack/markets';

export const features = {
  stackingEnabled: false,
};
