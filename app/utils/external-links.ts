import { isWebUri } from 'valid-url';

export async function openExternalLink(url: string) {
  if (!isWebUri(url)) throw new Error('Attempted to open suspicious uri');
  return api.openExternalLink(url);
}

export function makeExplorerLink(txId: string) {
  return `https://testnet-explorer.blockstack.org/txid/${txId}?w`;
}

export async function openInExplorer(txid: string) {
  return openExternalLink(makeExplorerLink(txid));
}
