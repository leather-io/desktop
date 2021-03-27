import Store from 'electron-store';
import { ipcMain } from 'electron';

const store = new Store({
  clearInvalidConfig: true,
});

export function registerIpcStoreHandlers() {
  ipcMain.handle('store-set', (_e, { key, value }: any) => store.set(key, value));

  ipcMain.handle('store-get', (_e, { key }: any) => store.get(key));

  ipcMain.handle('store-delete', (_e, { key }: any) => store.delete(key));

  // ipcMain.handle('store-getEntireStore', () => store.store);
  ipcMain.handle('store-clear', () => store.clear());

  ipcMain.on('store-getEntireStore', event => {
    event.returnValue = store.store;
  });
}
