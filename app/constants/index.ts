import { whenNetwork } from '@utils/network-utils';
import packageJson from '../../package.json';
import { stxToMicroStx } from '../utils/unit-convert';

type Environments = 'development' | 'testing' | 'production';

export const NETWORK = CONFIG.STX_NETWORK;

export const ENV = (CONFIG.NODE_ENV ?? 'production') as Environments;

export const MNEMONIC_ENTROPY = 256;

export const STX_DECIMAL_PRECISION = 6;

export const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0` as const;

export const ENTITY_NAME = 'Hiro Systems';

export const FULL_ENTITY_NAME = 'Hiro Systems PBC';

export const WALLET_VERSION = packageJson.version;

export const BUY_STX_URL = 'https://coinmarketcap.com/currencies/stacks/markets';

export const STATUS_PAGE_URL = 'http://status.test-blockstack.com';

export const DEFAULT_STACKS_NODE_URL = whenNetwork<string>({
  mainnet: 'https://stacks-node-api.mainnet.stacks.co',
  testnet: 'https://stacks-node-api.testnet.stacks.co',
});

export const EXPLORER_URL = 'https://explorer.stacks.co';

export const GITHUB_ORG = 'blockstack';

export const GITHUB_REPO = 'stacks-wallet';

export const TREZOR_HELP_URL =
  'https://www.blockstack.org/questions/how-can-i-use-my-trezor-device-with-the-stacks-wallet';

export const MAX_STACKING_CYCLES = 12;

export const MIN_STACKING_CYCLES = 1;

export const MIN_DELEGATED_STACKING_AMOUNT_USTX = 50_000_000;

export const MAX_DELEGATED_STACKING_AMOUNT_USTX = stxToMicroStx(10_000_000_000);

export const STX_TRANSFER_TX_SIZE_BYTES = 180;

export const SUPPORTED_BTC_ADDRESS_FORMATS = ['p2pkh', 'p2sh'] as const;

export const DEFAULT_POLLING_INTERVAL = 10_000;

export const features = {
  stacking: true,
  lifetimeRewards: false,
  txContentMenus: false,
};
