import { Transaction } from '@blockstack/stacks-blockchain-api-types';

import { hasMemo, getRecipientAddress } from '@utils/tx-utils';
import { features } from '../../../constants/index';

export function registerHandler(el: HTMLButtonElement | null, handler: (e: Event) => void) {
  if (el === null) return;
  el.addEventListener('contextmenu', handler);
}

export function deregisterHandler(el: HTMLButtonElement | null, handler: (e: Event) => void) {
  if (el === null) return;
  el.removeEventListener('contextmenu', handler);
}
interface TxListContextMenu {
  tx: Transaction;
  copy: {
    txid: string;
    recipientAddress: string;
    memo: string;
    date: string;
    txDetails: string;
    explorerLink: string;
  };
}

export function createTxListContextMenu(event: Event, { tx, copy }: TxListContextMenu) {
  event.preventDefault();
  if (!features.txContentMenus) return;
  const menuItems: { menu: Electron.MenuItemConstructorOptions; textToCopy?: string }[] = [
    {
      menu: {
        label: 'Copy to clipboard',
        enabled: false,
      },
    },
    { menu: { type: 'separator' } },
    {
      textToCopy: copy.txid,
      menu: {
        label: 'Transaction ID',
      },
    },
    {
      textToCopy: copy.recipientAddress,
      menu: {
        label: 'Recipient address',
        visible: !!getRecipientAddress(tx),
      },
    },
    {
      textToCopy: copy.memo,
      menu: {
        label: 'Memo',
        visible: hasMemo(tx),
      },
    },
    {
      textToCopy: copy.date,
      menu: {
        label: 'Timestamp',
      },
    },
    {
      textToCopy: copy.txDetails,
      menu: {
        label: 'Transaction (as JSON)',
      },
    },
    {
      textToCopy: copy.explorerLink,
      menu: {
        label: 'Explorer link',
      },
    },
  ];
  api.contextMenu(menuItems);
}
