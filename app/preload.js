/* eslint-disable @typescript-eslint/no-var-requires */
console.log('preload');

const { contextBridge, ipcRenderer, app } = require('electron');
const fs = require('fs');
const Store = require('secure-electron-store').default;

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

// Create the electron store to be made available in the renderer process
const store = new Store();

contextBridge.exposeInMainWorld('electron', {
  scriptsToLoad,
  __dirname,
  __filename,
});

contextBridge.exposeInMainWorld('process', { ...process });

contextBridge.exposeInMainWorld('api', {
  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  store: store.preloadBindings(ipcRenderer, fs),

  deriveKey: async args => {
    console.log('deriveKey', args);
    return ipcRenderer.invoke('derive-key', args);
  },
});
