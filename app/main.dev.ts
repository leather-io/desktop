/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, ipcMain, session } from 'electron';
import windowState from 'electron-window-state';
import contextMenu from 'electron-context-menu';
import installExtension, { ExtensionReference, REDUX_DEVTOOLS } from 'electron-devtools-installer';

import MenuBuilder from './menu';
import { deriveKey } from './crypto/key-generation';

import { validateConfig } from './main/validate-config';
import { getUserDataPath } from './main/get-user-data-path';
import { registerLedgerListeners } from './main/register-ledger-listeners';
import { registerIpcStoreHandlers } from './main/register-store-handlers';
import { registerIpcContextMenuHandlers } from './main/register-context-menus';
import { addMacOsTouchBarMenu } from './main/macos-touchbar-menu';
import { registerThemeModeHandlers } from './main/register-theme-mode-handlers';

// CSP enabled in production mode, don't warn in development
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

contextMenu({ showCopyImage: false, showSearchWithGoogle: false });

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

app.setPath('userData', getUserDataPath(app));
app.setPath('logs', path.join(getUserDataPath(app), 'logs'));
app.commandLine.appendSwitch('js-flags', '--expose-gc');

// https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/2788
const extensions: ExtensionReference[] = [REDUX_DEVTOOLS]; // [REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS];

const createWindow = async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await app.whenReady();
    await installExtension(extensions, {
      loadExtensionOptions: { allowFileAccess: true },
    } as any)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err))
      .finally(() => require('electron-debug')());
  }

  // https://github.com/electron/electron/issues/22995
  session.defaultSession.setSpellCheckerDictionaryDownloadURL('https://00.00/');

  const mainWindowState = windowState({
    defaultWidth: 1024,
    defaultHeight: 728,
  });

  const iconPath =
    process.env.STX_NETWORK === 'mainnet'
      ? path.join(__dirname, '../resources/icon-512x512.png')
      : path.join(__dirname, '../resources/icon-512x512-testnet.png');

  mainWindow = new BrowserWindow({
    show: false,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: process.platform !== 'darwin',
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    icon: iconPath,
    title: `Hiro Wallet` + (process.env.STX_NETWORK === 'testnet' ? ' Testnet' : ''),
    webPreferences: {
      disableBlinkFeatures: 'Auxclick',
      spellcheck: false,
      webSecurity: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      enableRemoteModule: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.platform === 'darwin') mainWindow.setTrafficLightPosition({ x: 10, y: 28 });

  mainWindowState.manage(mainWindow);

  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_PROD !== 'true') {
    void mainWindow.loadFile(`app-dev.html`);
  }

  if (process.env.NODE_ENV === 'production' || process.env.DEBUG_PROD === 'true') {
    void mainWindow.loadURL(`file://${__dirname}/app.html`);
  }

  if (process.platform === 'win32') {
    mainWindow.setMenuBarVisibility(false);
  }

  let hasFocusedOnInitialLoad = false;

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      if (hasFocusedOnInitialLoad) return;
      mainWindow.show();
      mainWindow.focus();
      hasFocusedOnInitialLoad = true;
    }
  });

  mainWindow.on('blur', () => mainWindow?.webContents.send('blur'));
  mainWindow.on('focus', () => mainWindow?.webContents.send('focus'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Disable all wallet permissions
  // eslint-disable-next-line no-warning-comments
  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, permCallback) => {
    permCallback(false);
  });

  registerLedgerListeners(mainWindow.webContents);

  registerThemeModeHandlers(mainWindow.webContents);

  registerIpcContextMenuHandlers(mainWindow);

  if (process.platform === 'darwin') addMacOsTouchBarMenu(mainWindow);
};

app.on('web-contents-created', (_event, contents) => {
  // eslint-disable-next-line no-warning-comments
  // https://www.electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
  contents.on('will-navigate', event => event.preventDefault());

  // Prohibit any `window.open` calls
  // https://electronjs.org/docs/api/window-open#browserwindowproxy-example
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  void createWindow();
  // We only want to run these once per app lifecycle
  void app.whenReady().then(() => registerIpcStoreHandlers(getUserDataPath(app)));
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) void createWindow();
});

validateConfig(app);

ipcMain.handle('derive-key', async (_e, args) => {
  return deriveKey(args);
});

ipcMain.handle('reload-app', () => mainWindow?.reload());

ipcMain.on('closeWallet', () => app.exit(0));
