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
import { app, BrowserWindow, clipboard, ipcMain, Menu, session } from 'electron';
import Store from 'electron-store';
import windowState from 'electron-window-state';
import contextMenu from 'electron-context-menu';

import MenuBuilder from './menu';
import { deriveKey } from './crypto/key-generation';
import { validateConfig } from './main/validate-config';
import { getUserDataPath } from './main/get-user-data-path';
import { registerLedgerListeners } from './main/register-ledger-listeners';

// CSP enabled in production mode, don't warn in development
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

contextMenu({ showCopyImage: false, showSearchWithGoogle: false });

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
}

app.setPath('userData', getUserDataPath(app));
app.setPath('logs', path.join(getUserDataPath(app), 'logs'));

const installExtensions = () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  // https://github.com/electron/electron/issues/22995
  session.defaultSession.setSpellCheckerDictionaryDownloadURL('https://00.00/');
  session.fromPartition('some-partition').setSpellCheckerDictionaryDownloadURL('https://00.00/');

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
    title: `Stacks Wallet` + (process.env.STX_NETWORK === 'testnet' ? ' Testnet' : ''),
    webPreferences: {
      disableBlinkFeatures: 'Auxclick',
      spellcheck: false,
      webSecurity: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
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

  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  registerLedgerListeners(mainWindow.webContents);
};

app.on('web-contents-created', (_event, contents) => {
  contents.on('will-navigate', event => event.preventDefault());
  contents.on('new-window', event => event.preventDefault());
});

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) void createWindow();
});

validateConfig(app);

const store = new Store({
  clearInvalidConfig: true,
});

ipcMain.handle('store-set', (_e, { key, value }: any) => store.set(key, value));
ipcMain.handle('store-get', (_e, { key }: any) => store.get(key));
ipcMain.handle('store-delete', (_e, { key }: any) => store.delete(key));
// ipcMain.handle('store-getEntireStore', () => store.store);
ipcMain.handle('store-clear', () => store.clear());
ipcMain.on('store-getEntireStore', event => {
  event.returnValue = store.store;
});

ipcMain.handle('derive-key', async (_e, args) => {
  return deriveKey(args);
});

ipcMain.handle('reload-app', () => {
  mainWindow?.reload();
});

ipcMain.on('closeWallet', () => app.exit(0));

//
// TODO: refactor to be more generic
// There's a bug where click handler doesn't fire for the top-level menu
ipcMain.on(
  'context-menu-open',
  (
    _e,
    args: { menuItems: { menu: Electron.MenuItemConstructorOptions; textToCopy?: string }[] }
  ) => {
    const copyMenu = args.menuItems.map(item => {
      const newItem = { ...item };
      if (newItem.textToCopy) {
        newItem.menu.click = () => clipboard.writeText(newItem.textToCopy as any);
      }
      return newItem.menu;
    });
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Copy',
        submenu: copyMenu,
      },
    ]);
    contextMenu.popup({ window: mainWindow?.getParentWindow() });
    contextMenu.once('menu-will-close', () => {
      // `destroy` call untyped
      (contextMenu as any).destroy();
    });
  }
);
