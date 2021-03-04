import Transport from '@ledgerhq/hw-transport';
import StacksApp, { ResponseAddress, ResponseSign } from '@zondax/ledger-blockstack';

const STX_DERIVATION_PATH = `m/44'/5757'/0'/0/0`;

export async function ledgerRequestStxAddress(transport: Transport | null) {
  if (!transport) throw new Error('No device transport');
  const stacksApp = new StacksApp(transport);
  const resp = await stacksApp.showAddressAndPubKey(STX_DERIVATION_PATH);
  if (resp.publicKey) {
    return { ...resp, publicKey: resp.publicKey.toString('hex') };
  }
  return resp as Omit<ResponseAddress, 'publicKey'>;
}

export async function ledgerShowStxAddress(transport: Transport | null) {
  if (!transport) throw new Error('No device transport');
  const stacksApp = new StacksApp(transport);
  const resp = await stacksApp.getAddressAndPubKey(STX_DERIVATION_PATH);
  return resp;
}

export function ledgerRequestSignTx(transport: Transport | null) {
  return async (unsignedTransaction: string) => {
    if (!transport) throw new Error('No device transport');

    const stacksApp = new StacksApp(transport);
    const txBuffer = Buffer.from(unsignedTransaction, 'hex');
    const signatures: ResponseSign = await stacksApp.sign(STX_DERIVATION_PATH, txBuffer);
    await transport.close();
    return {
      ...signatures,
      postSignHash: signatures.postSignHash.toString('hex'),
      signatureCompact: signatures.signatureCompact.toString('hex'),
      signatureVRS: signatures.signatureVRS.toString('hex'),
      signatureDER: signatures.signatureDER.toString('hex'),
    };
  };
}
