import { remote } from 'electron';
import { useClipboard } from '@blockstack/ui';
import { Transaction } from '@blockstack/stacks-blockchain-sidecar-types';

import { hasMemo, getRecipientAddress } from '../../../utils/tx-utils';

export function registerHandler(el: HTMLDivElement | null, handler: (e: Event) => void) {
  if (el === null) return;
  el.addEventListener('contextmenu', handler, false);
}

export function deregisterHandler(el: HTMLDivElement | null, handler: (e: Event) => void) {
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

export function createTxListContextMenu({ tx, copy }: TxListContextMenu) {
  const { Menu, MenuItem } = remote;
  const menu = new Menu();

  menu.append(
    new MenuItem({
      label: 'Copy to clipboard',
      enabled: false,
    })
  );
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(
    new MenuItem({
      label: 'Transaction ID',
      click: () => copy.txid.onCopy(),
    })
  );
  if (getRecipientAddress(tx)) {
    menu.append(
      new MenuItem({
        label: 'Recipient address',
        click: () => copy.recipientAddress.onCopy(),
      })
    );
  }
  menu.append(
    new MenuItem({
      label: 'Timestamp',
      click: () => copy.date.onCopy(),
    })
  );
  if (hasMemo(tx)) {
    menu.append(
      new MenuItem({
        label: 'Memo',
        click: () => copy.memo.onCopy(),
      })
    );
  }
  menu.append(
    new MenuItem({
      label: 'Transaction (as JSON)',
      click: () => copy.txDetails.onCopy(),
    })
  );
  menu.append(
    new MenuItem({
      label: 'Explorer link',
      click: () => copy.explorerLink.onCopy(),
    })
  );

  menu.popup({
    window: remote.getCurrentWindow(),
  });
  menu.once('menu-will-close', () => {
    // `destroy` call untyped
    (menu as any).destroy();
  });
}
