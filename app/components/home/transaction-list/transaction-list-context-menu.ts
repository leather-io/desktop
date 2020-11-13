import { useClipboard } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-api-types';

import { hasMemo, getRecipientAddress } from '@utils/tx-utils';

export function registerHandler(el: HTMLButtonElement | null, handler: (e: Event) => void) {
  if (el === null) return;
  el.addEventListener('contextmenu', handler);
}

export function deregisterHandler(el: HTMLButtonElement | null, handler: (e: Event) => void) {
  if (el === null) return;
  el.removeEventListener('contextmenu', handler);
}

type UiClipboard = ReturnType<typeof useClipboard>;

interface TxListContextMenu {
  tx: Transaction;
  copy: {
    txid: UiClipboard;
    recipientAddress: UiClipboard;
    memo: UiClipboard;
    date: UiClipboard;
    txDetails: UiClipboard;
    explorerLink: UiClipboard;
  };
}

export function createTxListContextMenu(event: Event, { tx, copy }: TxListContextMenu) {
  event.preventDefault();
  const menuItems: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Copy to clipboard',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: 'Transaction ID',
      click: () => copy.txid.onCopy(),
    },
    {
      label: 'Recipient address',
      visible: !!getRecipientAddress(tx),
      click: () => copy.recipientAddress.onCopy(),
    },
    {
      label: 'Memo',
      visible: hasMemo(tx),
      click: () => copy.memo.onCopy(),
    },
    {
      label: 'Timestamp',
      click: () => copy.date.onCopy(),
    },
    {
      label: 'Transaction (as JSON)',
      click: () => copy.txDetails.onCopy(),
    },
    {
      label: 'Explorer link',
      click: () => copy.explorerLink.onCopy(),
    },
  ];
  api.contextMenu(menuItems);
}
