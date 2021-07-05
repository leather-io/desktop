import Transport from '@ledgerhq/hw-transport';
import { AddressVersion } from '@stacks/transactions';
import StacksApp, { LedgerError, ResponseAddress, ResponseSign } from '@zondax/ledger-blockstack';

const chainIdMap = {
  mainnet: AddressVersion.MainnetSingleSig,
  testnet: AddressVersion.TestnetSingleSig,
};

const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0`;

export async function ledgerRequestStxAddress(transport: Transport | null) {
  if (!transport) throw new Error('No device transport');
  const stacksApp = new StacksApp(transport);
  const resp = await stacksApp.showAddressAndPubKey(
    STX_DERIVATION_PATH,
    chainIdMap[process.env.STX_NETWORK as keyof typeof chainIdMap]
  );
  if (resp.publicKey) {
    return { ...resp, publicKey: resp.publicKey.toString('hex') };
  }
  return resp as Omit<ResponseAddress, 'publicKey'>;
}

export async function ledgerShowStxAddress(transport: Transport | null) {
  if (!transport) throw new Error('No device transport');
  const stacksApp = new StacksApp(transport);
  const resp = await stacksApp.getAddressAndPubKey(
    STX_DERIVATION_PATH,
    chainIdMap[process.env.STX_NETWORK as keyof typeof chainIdMap]
  );
  return resp;
}

export function ledgerRequestSignTx(transport: Transport | null) {
  return async (unsignedTransaction: string) => {
    if (!transport) throw new Error('No device transport');

    const stacksApp = new StacksApp(transport);
    const txBuffer = Buffer.from(unsignedTransaction, 'hex');
    const response: ResponseSign = await stacksApp.sign(STX_DERIVATION_PATH, txBuffer);
    await transport.close();
    if (response.returnCode !== LedgerError.NoErrors) {
      return response;
    }
    return {
      ...response,
      postSignHash: response.postSignHash.toString('hex'),
      signatureCompact: response.signatureCompact.toString('hex'),
      signatureVRS: response.signatureVRS.toString('hex'),
      signatureDER: response.signatureDER.toString('hex'),
    };
  };
}
