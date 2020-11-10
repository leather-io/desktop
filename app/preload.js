/* eslint-disable @typescript-eslint/no-var-requires */
console.log('preload');
const fs = require('fs');

const { ChainID } = require('@blockstack/stacks-transactions');
const { contextBridge, ipcRenderer, app } = require('electron');

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
});
contextBridge.exposeInMainWorld('process', { ...process });
contextBridge.exposeInMainWorld('fs', fs);

contextBridge.exposeInMainWorld('Buffer', Buffer);
