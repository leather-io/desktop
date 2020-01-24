const API_URL = "https://blockstack-explorer-api.herokuapp.com";

const BSKPK =
  "03956cd9ba758cb7be56d0f8d52476673814d8dbb3c1a728d73a36b3b9268f9cba";

const PATH = `m/44'/5757'/0'/0/0`;

const CORE_NODE_URI = "https://core.blockstack.org";

const CORE_NODE_URI_TEST_NET = "http://testnet.blockstack.org:16268";

const UTXO_SERVICE_URI = "https://utxo.blockstack.org";

const TESTNET_ADDRESS_PREFIX = {
  wif: 0x6f,
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  }
};

let debug = false;

const HAS_DEBUG_FLAG = debug || false;

const HAS_WINDOW = typeof window !== "undefined";

const IS_BROWSER = HAS_WINDOW || typeof self !== "undefined";

const IS_PROD = process.env.NODE_ENV === "production";

const STACKS_BLOCKCHAIN_VERSION = "1.0"

const ROUTES = {
  TERMS: "/",
  DASHBOARD: "/dashboard",
  SETUP: "/setup",
  NEW_OPTIONS: "/new-options",
  RESTORE_OPTIONS: "/restore-options",
  NEW_SEED: "/new-seed",
  CONFIRM_SEED: "/confirm-seed",
  RESTORE_SEED: "/restore-seed",
  RESTORE_HARDWARE: "/restore-hardware",
  RESTORE_LEDGER: "/restore-ledger",
  RESTORE_TREZOR: "/restore-trezor",
  RESTORE_WATCH: "/restore-watch"
};

export {
  API_URL,
  BSKPK,
  PATH,
  CORE_NODE_URI,
  CORE_NODE_URI_TEST_NET,
  UTXO_SERVICE_URI,
  TESTNET_ADDRESS_PREFIX,
  HAS_DEBUG_FLAG,
  HAS_WINDOW,
  IS_BROWSER,
  IS_PROD,
  ROUTES,
  STACKS_BLOCKCHAIN_VERSION
};
