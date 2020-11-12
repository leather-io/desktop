/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { contextBridge, ipcRenderer, app } = require('electron');

const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default;

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

// SECURITY: don't expose entire process obj
contextBridge.exposeInMainWorld('process', { ...process });

contextBridge.exposeInMainWorld('api', {
  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  store: {
    set: (key, value) => ipcRenderer.invoke('store-set', { key, value }),
    get: key => ipcRenderer.invoke('store-get', { key }),
    delete: key => ipcRenderer.invoke('store-delete', { key }),
    clear: () => ipcRenderer.invoke('store-clear'),
    initialValue: () => ipcRenderer.sendSync('store-getEntireStore'),
  },

  deriveKey: async args => {
    return ipcRenderer.invoke('derive-key', args);
  },

  nodeHid: {
    listen: observer => TransportNodeHid.listen(observer),
    open: async ({ descriptor, onDisconnect }) => {
      const transport = await TransportNodeHid.open(descriptor);
      transport.on('disconnect', async () => {
        await transport.close();
        onDisconnect();
      });
      return {
        transport,
        closeTransportConnection: async () => {
          await transport.close();
        },
      };
    },
  },
});
