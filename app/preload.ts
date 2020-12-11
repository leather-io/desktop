/* eslint-disable @typescript-eslint/no-var-requires */
import { contextBridge, ipcRenderer, shell } from 'electron';

// These two modules are excluded from the bundle, so they can
// be imported at runtime in the preload's `require`, rather
// than being bundled in the output script
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import argon2 from 'argon2-browser';

const scriptsToLoad = [];

if (process.env.NODE_ENV === 'development') {
  // Dynamically insert the DLL script in development env in the
  // renderer process
  scriptsToLoad.push('../dll/renderer.dev.dll.js');
}
if (process.env.START_HOT) {
  // Dynamically insert the bundled app script in the renderer process
  const port = process.env.PORT || 1212;
  scriptsToLoad.push(`http://localhost:${port}/dist/renderer.dev.js`);
} else {
  scriptsToLoad.push('./dist/renderer.prod.js');
}

contextBridge.exposeInMainWorld('electron', {
  scriptsToLoad,
  __dirname,
  __filename,
});

async function deriveKey({ pass, salt }: Record<string, 'pass' | 'salt'>) {
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

contextBridge.exposeInMainWorld('process', { ...process });

contextBridge.exposeInMainWorld('api', {
  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  store: {
    set: (key: string, value: string) => ipcRenderer.invoke('store-set', { key, value }),
    get: (key: string) => ipcRenderer.invoke('store-get', { key }),
    delete: (key: string) => ipcRenderer.invoke('store-delete', { key }),
    clear: () => ipcRenderer.invoke('store-clear'),
    initialValue: () => ipcRenderer.sendSync('store-getEntireStore'),
  },

  deriveKey: async (args: any) => {
    return deriveKey(args);
  },

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

  nodeHid: {
    // listen: observer => TransportNodeHid.listen(observer),
    open: async ({ descriptor, onDisconnect }: any) => {
      const transport = await TransportNodeHid.open(descriptor);
      transport.on('disconnect', async () => {
        await transport.close();
        setTimeout(() => onDisconnect(), 0);
      });
      return {
        transport,
        closeTransportConnection: async () => {
          await transport.close();
        },
      };
    },
  },

  contextMenu: (menuItems: any) => ipcRenderer.send('context-menu-open', { menuItems }),
});
