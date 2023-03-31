import { whenNetwork } from './utils/network-utils';
import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { ChainID } from '@stacks/transactions';

export { ChainID };

export const chain = whenNetwork<ChainID>({
  testnet: ChainID.Testnet,
  mainnet: ChainID.Mainnet,
});

export const stacksNetwork = whenNetwork<StacksNetwork>({
  mainnet: new StacksMainnet(),
  testnet: new StacksTestnet(),
});
