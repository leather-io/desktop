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
  testnet:
    process.env.DEFAULT_TESTNET_STACKS_NODE_URL ?? 'https://stacks-node-api.testnet.stacks.co',
});

export const EXPLORER_URL = 'https://explorer.stacks.co';

export const GITHUB_ORG = 'blockstack';

export const GITHUB_REPO = 'stacks-wallet';

export const TREZOR_HELP_URL =
  'https://www.hiro.so/questions/how-can-i-use-my-trezor-device-with-the-stacks-wallet';

export const STACKING_ADDRESS_FORMAT_HELP_URL =
  'https://www.hiro.so/questions/what-form-of-btc-addresses-can-i-use-for-proof-of-transfer-rewards';

export const STACKING_LEARN_MORE_URL = 'https://stacks.org/stacking-moves-us-forward';

export const STACKING_GUIDE_URL = 'https://blog.stacks.co/stacking-strategy';

export const STACKING_MINIMIUM_FOR_NEXT_CYCLE_URL =
  'https://stacking.club/cycles/next?tab=slot_minimum';

export const MAX_STACKING_CYCLES = 12;

export const MIN_STACKING_CYCLES = 1;

export const MIN_DELEGATED_STACKING_AMOUNT_USTX = 50_000_000;

export const UI_IMPOSED_MAX_STACKING_AMOUNT_USTX = stxToMicroStx(10_000_000_000);

export const STX_TRANSFER_TX_SIZE_BYTES = 180;

export const REVOKE_DELEGATION_TX_SIZE_BYTES = 165;

export const STACKING_CONTRACT_CALL_TX_BYTES = 260;

export const POOLED_STACKING_TX_SIZE_BYTES = 216;

export const SUPPORTED_BTC_ADDRESS_FORMATS = ['p2pkh', 'p2sh'] as const;

export const LATEST_LEDGER_VERSION_MAJOR = 0;

export const LATEST_LEDGER_VERSION_MINOR = 14;

export const EARLIEST_SUPPORTED_LEDGER_VERSION = '0.11.0';

export const FEE_RATE = 400;

export const DEFAULT_POLLING_INTERVAL = 10_000;

export const SEND_MANY_CONTACT_ID = 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.send-many-memo';

export const features = {
  stacking: true,
  lifetimeRewards: false,
  txContentMenus: true,
  microblocks: true,
};
