import {
  createStacksPrivateKey,
  getPublicKey,
  makeUnsignedSTXTokenTransfer,
  publicKeyToString,
  TokenTransferOptions,
  TransactionSigner,
} from '@stacks/transactions';

interface CreateSoftwareWalletTokenTransferTx {
  privateKey: string;
  txOptions: TokenTransferOptions;
}
export async function createSoftwareWalletTokenTransferTx(
  args: CreateSoftwareWalletTokenTransferTx
) {
  const { privateKey, txOptions } = args;
  const senderKey = createStacksPrivateKey(privateKey);
  const publicKey = publicKeyToString(getPublicKey(senderKey));
  const tx = await makeUnsignedSTXTokenTransfer({ ...txOptions, publicKey });
  const signer = new TransactionSigner(tx);
  signer.signOrigin(senderKey);
  return tx;
}
