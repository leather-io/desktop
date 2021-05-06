import { ipcMain, nativeTheme, WebContents } from 'electron';

export function registerThemeModeHandlers(webContents: WebContents) {
  nativeTheme.on('updated', () => {
    webContents.send('message-event', {
      type: 'theme-event',
      shouldUseDarkMode: nativeTheme.shouldUseDarkColors,
    });
  });

  webContents.on('destroyed', () => {
    nativeTheme.removeAllListeners();
    ipcMain.removeHandler('theme:toggle-mode');
    ipcMain.removeHandler('theme:set-system-mode');
  });

  ipcMain.on(
    'theme:get-current',
    e => (e.returnValue = nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
  );

  ipcMain.handle('theme:toggle-mode', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('theme:set-system-mode', () => {
    nativeTheme.themeSource = 'system';
  });
}
