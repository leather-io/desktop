import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import { deriveRootKeychainFromMnemonic } from '@blockstack/keychain';
import { makeSTXTokenTransfer } from '@blockstack/stacks-transactions';

import { stacksNetwork } from './environment';
import { deriveStxAddressKeychain } from './derive-address-keychain';

interface CreateStxTxArgs {
  mnemonic: string;
  recipient: string;
  amount: BigNumber;
}

export async function createStxTransaction({ mnemonic, recipient, amount }: CreateStxTxArgs) {
  const rootNode = await deriveRootKeychainFromMnemonic(mnemonic);
  const { privateKey } = deriveStxAddressKeychain(rootNode);
  return await makeSTXTokenTransfer({
    recipient,
    amount: new BN(amount.toString()),
    senderKey: privateKey,
    network: stacksNetwork,
  });
}
