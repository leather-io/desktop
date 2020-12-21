import packageJson from '../../package.json';

export const MNEMONIC_ENTROPY = 256;

type Environments = 'development' | 'testing' | 'production';

export const STX_DECIMAL_PRECISION = 6;

export const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0` as const;

export const ENTITY_NAME = 'Blockstack';

export const FULL_ENTITY_NAME = 'Blockstack PBC';

export const ENV = (process.env.NODE_ENV ?? 'production') as Environments;

export const WALLET_VERSION = packageJson.version;

export const BUY_STX_URL = 'https://coinmarketcap.com/currencies/blockstack/markets';

export const STATUS_PAGE_URL = 'http://status.test-blockstack.com';

export const DEFAULT_STACKS_NODE_URL = 'https://stacks-node-api.blockstack.org';

export const GITHUB_ORG = 'blockstack';

export const GITHUB_REPO = 'stacks-wallet';

export const TREZOR_HELP_URL =
  'https://www.blockstack.org/questions/how-can-i-use-my-trezor-device-with-the-stacks-wallet';

export const NETWORK = process.env.STX_NETWORK as 'mainnet' | 'testnet';

export const MAX_STACKING_CYCLES = 12;

export const MIN_STACKING_CYCLES = 1;

export const STX_TRANSFER_TX_SIZE_BYTES = 180;

export const SUPPORTED_BTC_ADDRESS_FORMATS = ['p2pkh', 'p2sh'] as const;

export const features = {
  stacking: true,
  lifetimeRewards: false,
  txContentMenus: false,
};
