import { ChainID } from '@stacks/transactions';
import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { whenNetwork } from './utils/network-utils';

export { ChainID };

export const chain = whenNetwork<ChainID>({
  testnet: ChainID.Testnet,
  mainnet: ChainID.Mainnet,
});

export const stacksNetwork = whenNetwork<StacksNetwork>({
  mainnet: new StacksMainnet(),
  testnet: new StacksTestnet(),
});
