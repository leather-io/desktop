import Store from 'electron-store';
import { ipcMain } from 'electron';

export function registerIpcStoreHandlers(userDataPath: string) {
  const store = new Store({
    clearInvalidConfig: true,
    cwd: userDataPath,
  });

  ipcMain.handle('store-set', (_e, { key, value }: any) => store.set(key, value));

  ipcMain.handle('store-get', (_e, { key }: any) => store.get(key));

  ipcMain.handle('store-delete', (_e, { key }: any) => store.delete(key));

  // ipcMain.handle('store-getEntireStore', () => store.store);
  ipcMain.handle('store-clear', () => store.clear());

  ipcMain.on('store-getEntireStore', event => {
    event.returnValue = store.store;
  });
}
