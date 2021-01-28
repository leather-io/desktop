import validate from 'bitcoin-address-validation';
import { isMainnet, isTestnet } from '@utils/network-utils';
import { SUPPORTED_BTC_ADDRESS_FORMATS } from '@constants/index';

export function btcAddressValidator(btcAddress: string) {
  const address = validate(btcAddress);
  if (!address) return { btcAddress: 'Invalid BTC address' };
  if (isMainnet() && address.network === 'testnet') {
    return { btcAddress: 'Testnet addresses not supported on Mainnet' };
  }
  if (isTestnet() && address.network !== 'testnet') {
    return { btcAddress: 'Mainnet addresses not supported on Testnet' };
  }
  // https://github.com/blockstack/stacks-blockchain/issues/1902
  if (!SUPPORTED_BTC_ADDRESS_FORMATS.includes(address.type as any)) {
    return {
      btcAddress: 'Only Pubkey hash (p2pkh) and Script hash (p2sh) addresses are supported',
    };
  }
  return {};
}
