import { SUPPORTED_BTC_ADDRESS_FORMATS } from '@constants/index';
import { isMainnet, isTestnet } from '@utils/network-utils';
import { validate, getAddressInfo } from 'bitcoin-address-validation';
import * as yup from 'yup';

export function btcAddressSchema() {
  return yup
    .string()
    .defined(`Enter the BTC address where you'd like to receive your rewards`)
    .test({
      name: 'valid address',
      message: `The BTC address you've entered is not valid`,
      test(value: unknown) {
        if (typeof value !== 'string') return false;
        const isValid = validate(value);
        if (!isValid) return this.createError({ message: 'Invalid BTC address' });
        const addressInfo = getAddressInfo(value);
        if (!addressInfo) return this.createError({ message: 'Invalid BTC address' });
        if (isMainnet() && addressInfo.network === 'testnet') {
          return this.createError({ message: 'Testnet addresses not supported on Mainnet' });
        }
        if (isTestnet() && addressInfo.network !== 'testnet') {
          return this.createError({ message: 'Mainnet addresses not supported on Testnet' });
        }
        // https://github.com/blockstack/stacks-blockchain/issues/1902
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (!SUPPORTED_BTC_ADDRESS_FORMATS.includes(addressInfo.type as any)) {
          return this.createError({
            message:
              'Unsupported address type. Please use a legacy (P2PKH), pay to script hash (P2SH), native segwit (P2WPKH) or taproot (P2TR) address',
          });
        }
        return true;
      },
    });
}
