import {
  ChainID,
  StacksNetwork,
  StacksTestnet,
  StacksMainnet,
} from '@blockstack/stacks-transactions';
import { ENV } from './constants';

export { ChainID };

// export const chain = ENV === 'development' || ENV === 'testing' ? ChainID.Testnet : ChainID.Mainnet;
export const chain = ChainID.Testnet;

// export const stacksNetwork: StacksNetwork =
//   ENV === 'development' || ENV === 'testing' ? new StacksTestnet() : new StacksMainnet();

export const stacksNetwork = new StacksTestnet();
