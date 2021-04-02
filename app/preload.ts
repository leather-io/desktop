import 'regenerator-runtime/runtime';

import { contextBridge, ipcRenderer, shell } from 'electron';

import argon2 from 'argon2-browser';
import type {
  LedgerRequestSignTx,
  LedgerRequestStxAddress,
} from './main/register-ledger-listeners';

const scriptsToLoad = [];

if (process.env.NODE_ENV === 'development') {
  // Dynamically insert the DLL script in development env in the
  // renderer process
  scriptsToLoad.push('../dll/renderer.dev.dll.js');

  //
  // Electron 12 removed all commonjs access in renderer process
  // Webpack-dev-server uses module, this stops an error from
  // being thrown
  contextBridge.exposeInMainWorld('module', {});
}

if (process.env.START_HOT) {
  // Dynamically insert the bundled app script in the renderer process
  const port = 1212;
  scriptsToLoad.push(`http://localhost:${port}/dist/renderer.dev.js`);
} else {
  scriptsToLoad.push('./dist/renderer.prod.js');
}

contextBridge.exposeInMainWorld('electron', {
  scriptsToLoad,
  __dirname,
  __filename,
});

async function deriveArgon2Key({ pass, salt }: Record<'pass' | 'salt', string>) {
  const result = await argon2.hash({
    pass,
    salt,
    hashLen: 48,
    time: 44,
    mem: 1024 * 32,
    type: argon2.ArgonType.Argon2id,
  });
  return { derivedKeyHash: result.hash };
}

contextBridge.exposeInMainWorld('process', {
  version: process.version,
  platform: process.platform,
  nextTick: process.nextTick,
  env: {
    REACT_APP_SC_ATTR: null,
  },
});

const walletApi = {
  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  store: {
    set: async (key: string, value: string) => ipcRenderer.invoke('store-set', { key, value }),
    get: async (key: string) => ipcRenderer.invoke('store-get', { key }),
    delete: async (key: string) => ipcRenderer.invoke('store-delete', { key }),
    clear: async () => ipcRenderer.invoke('store-clear'),
    initialValue: () => ipcRenderer.sendSync('store-getEntireStore'),
  },

  deriveKey: async (args: Record<'pass' | 'salt', string>) => deriveArgon2Key(args),

  windowEvents: {
    blur(callback: () => void) {
      const listener = () => callback();
      ipcRenderer.on('blur', listener);
      return () => ipcRenderer.removeListener('blur', listener);
    },
    focus(callback: () => void) {
      const listener = () => callback();
      ipcRenderer.on('focus', listener);
      return () => ipcRenderer.removeListener('focus', listener);
    },
  },

  openExternalLink: (url: string) => shell.openExternal(url),

  reloadApp: () => ipcRenderer.invoke('reload-app'),

  contextMenu: (menuItems: any) => ipcRenderer.send('context-menu-open', { menuItems }),

  closeWallet: () => ipcRenderer.send('closeWallet'),

  getUserDataPath: () => ipcRenderer.sendSync('get-user-data-path'),

  theme: {
    getCurrentTheme() {
      return ipcRenderer.sendSync('theme:get-current');
    },
    toggleMode() {
      return ipcRenderer.invoke('theme:toggle-mode');
    },
    setDarkMode() {
      return ipcRenderer.invoke('theme:set-dark-mode');
    },
    setLightMode() {
      return ipcRenderer.invoke('theme:set-light-mode');
    },
    setSystemMode() {
      return ipcRenderer.invoke('theme:set-system-mode');
    },
  },

  ledger: {
    createListener: () => ipcRenderer.send('create-ledger-listener'),
    removeListener: () => ipcRenderer.send('remove-ledger-listener'),
    async signTransaction(unsignedTxHex: string) {
      return ipcRenderer.invoke('ledger-request-sign-tx', unsignedTxHex) as LedgerRequestSignTx;
    },
    async requestAndConfirmStxAddress() {
      return ipcRenderer.invoke('ledger-request-stx-address') as LedgerRequestStxAddress;
    },
    async showStxAddress() {
      return ipcRenderer.invoke('ledger-show-stx-address');
    },
  },
};

contextBridge.exposeInMainWorld('main', walletApi);

declare global {
  const main: typeof walletApi;
}

function postMessageToApp(data: unknown) {
  window.postMessage(data, '*');
}

ipcRenderer.on('message-event', (_event, data) => postMessageToApp({ ...data }));
