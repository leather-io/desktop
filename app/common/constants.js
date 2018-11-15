const API_URL = "https://blockstack-explorer-api.herokuapp.com";
const BSKPK =
  "03956cd9ba758cb7be56d0f8d52476673814d8dbb3c1a728d73a36b3b9268f9cba";
const PATH = `m/44'/5757'/0'/0/0`;
const CORE_NODE_URI = "http://testnet.blockstack.org:16268";
const CORE_NODE_URI_TEST_NET = "http://testnet.blockstack.org:16268";
const UTXO_SERVICE_URI = "https://utxo.blockstack.org";
const TESTNET_ADDRESS_PREFIX = {
  wif: 0x6f,
  bip32: {
    public: 0x043587cf,
    private: 0x04358394
  }
};

export {
  API_URL,
  BSKPK,
  PATH,
  CORE_NODE_URI,
  CORE_NODE_URI_TEST_NET,
  UTXO_SERVICE_URI,
  TESTNET_ADDRESS_PREFIX
};
