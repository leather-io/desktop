import urljoin from 'url-join';
import { isWebUri } from 'valid-url';
import { EXPLORER_URL, NETWORK } from '@constants/index';

export async function openExternalLink(url: string) {
  if (!isWebUri(url)) return;
  return api.openExternalLink(url);
}

export function makeExplorerLink(path: string) {
  return urljoin(EXPLORER_URL, `${path}?utm_source=stacks-wallet&chain=${NETWORK}`);
}

export function makeExplorerTxLink(txId: string) {
  return makeExplorerLink(`/txid/${txId}`);
}

export async function openTxInExplorer(txid: string) {
  return openExternalLink(makeExplorerTxLink(txid));
}

export function makeExplorerAddressLink(address: string) {
  return makeExplorerLink(`/address/${address}`);
}

export async function openAddressInExplorer(address: string) {
  return openExternalLink(makeExplorerAddressLink(address));
}
