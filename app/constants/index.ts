export const MNEMONIC_ENTROPY = 256;

type Environments = 'development' | 'testing' | 'production';

export const ENV = (process.env.NODE_ENV ?? 'production') as Environments;

export const BUY_STX_URL = 'https://coinmarketcap.com/currencies/blockstack/markets';

export const STATUS_PAGE_URL = 'http://status.test-blockstack.com';

export const DEFAULT_STACKS_NODE_URL = 'https://stacks-node-api.krypton.blockstack.org';

export const NETWORK = process.env.STX_NETWORK as 'mainnet' | 'testnet';

export const MAX_STACKING_CYCLES = 12;

export const MIN_STACKING_CYCLES = 1;

export const SUPPORTED_BTC_ADDRESS_FORMATS = ['p2pkh', 'p2sh'] as const;

export const features = {
  stacking: true,
  lifetimeRewards: false,
};
