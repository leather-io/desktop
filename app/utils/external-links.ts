import { isWebUri } from 'valid-url';

export async function openExternalLink(url: string) {
  if (!isWebUri(url)) throw new Error('Attempted to open suspicious uri');
  return api.openExternalLink(url);
}

export function makeExplorerTxLink(txId: string) {
  return `https://testnet-explorer.blockstack.org/txid/${txId}?w`;
}

export async function openTxInExplorer(txid: string) {
  return openExternalLink(makeExplorerTxLink(txid));
}

export function makeExplorerAddressLink(address: string) {
  return `https://testnet-explorer.blockstack.org/address/${address}`;
}

export async function openAddressInExplorer(address: string) {
  return openExternalLink(makeExplorerAddressLink(address));
}
