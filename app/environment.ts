import { ChainID } from '@stacks/transactions';
import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { NETWORK } from './constants';

export { ChainID };

export const chain = NETWORK === 'testnet' ? ChainID.Testnet : ChainID.Mainnet;

export const stacksNetwork: StacksNetwork =
  NETWORK === 'testnet' ? new StacksTestnet() : new StacksMainnet();
