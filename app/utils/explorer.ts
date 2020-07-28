import { shell } from 'electron';

export function makeExplorerLink(txId: string) {
  return `https://testnet-explorer.blockstack.org/txid/${txId}?w`;
}

export async function openInExplorer(txid: string) {
  return await shell.openExternal(makeExplorerLink(txid));
}
