import { shell } from 'electron';

export async function openExternalLink(url: string) {
  return shell.openExternal(url);
}

export function makeExplorerLink(txId: string) {
  return `https://testnet-explorer.blockstack.org/txid/${txId}?w`;
}

export async function openInExplorer(txid: string) {
  return openExternalLink(makeExplorerLink(txid));
}
