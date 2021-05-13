import * as yup from 'yup';
import { isMainnet, isTestnet } from '@utils/network-utils';
import validate, { getAddressInfo } from 'bitcoin-address-validation';
import { SUPPORTED_BTC_ADDRESS_FORMATS } from '@constants/index';

export function btcAddressSchema() {
  return yup
    .string()
    .defined(`Enter the BTC address where you'd like to recieve your rewards`)
    .test({
      name: 'slkdjfslk',
      message: `The BTC address you've entered is not valid`,
      test(value: unknown) {
        if (value === null || value === undefined) return false;
        if (typeof value !== 'string') return false;
        const isValid = validate(value);
        if (!isValid) return this.createError({ message: 'Invalid BTC address' });
        const validationReport = getAddressInfo(value);
        if (!validationReport) return this.createError({ message: 'Invalid BTC address' });
        if (isMainnet() && validationReport.network === 'testnet') {
          return this.createError({ message: 'Testnet addresses not supported on Mainnet' });
        }
        if (isTestnet() && validationReport.network !== 'testnet') {
          return this.createError({ message: 'Mainnet addresses not supported on Testnet' });
        }
        // https://github.com/blockstack/stacks-blockchain/issues/1902
        if (!SUPPORTED_BTC_ADDRESS_FORMATS.includes(validationReport.type as any)) {
          return this.createError({ message: 'is-bech32' });
        }
        return true;
      },
    });
}
