import { ipcMain, nativeTheme, WebContents } from 'electron';

export function registerThemeModeHandlers(webContents: WebContents) {
  nativeTheme.on('updated', () => {
    webContents.send('message-event', {
      type: 'theme-event',
      shouldUseDarkMode: nativeTheme.shouldUseDarkColors,
    });
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

  ipcMain.handle('theme:set-dark-mode', () => {
    nativeTheme.themeSource = 'dark';
  });

  ipcMain.handle('theme:set-light-mode', () => {
    nativeTheme.themeSource = 'light';
  });

  ipcMain.handle('theme:set-system-mode', () => {
    nativeTheme.themeSource = 'system';
  });
}
