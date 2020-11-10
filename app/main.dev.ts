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
import path from 'path';
import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import windowState from 'electron-window-state';
import contextMenu from 'electron-context-menu';
import MenuBuilder from './menu';

// CSP enabled in production mode, don't warn in development
delete process.env.ELECTRON_ENABLE_SECURITY_WARNINGS;
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// eslint-disable-next-line import/no-default-export
export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    void autoUpdater.checkForUpdatesAndNotify();
  }
}

contextMenu({ showCopyImage: false, showSearchWithGoogle: false });

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  import('source-map-support')
    .then(sourceMapSupport => sourceMapSupport.install())
    .catch(err => {
      throw err;
    });
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  import('electron-debug')
    .then(electronDebug => electronDebug.default())
    .catch(error => console.error(error));
}

const installExtensions = async () => {
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

  const mainWindowState = windowState({
    defaultWidth: 1024,
    defaultHeight: 728,
  });

  mainWindow = new BrowserWindow({
    show: false,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: process.platform !== 'darwin',
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    icon: path.join(__dirname, '../resources/icon-no-padding-512x512.png'),
    webPreferences: {
      webSecurity: true,
      contextIsolation: true,
      ...(process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true,
          }
        : {
            nodeIntegration: false,
            // preload: path.join(__dirname, 'dist/renderer.prod.js'),
          }),
    },
  });

  if (process.platform === 'darwin') mainWindow.setTrafficLightPosition({ x: 10, y: 28 });

  mainWindowState.manage(mainWindow);

  if (process.env.NODE_ENV === 'development' && process.env.DEBUG_PROD !== 'true') {
    void mainWindow.loadURL(`file://${__dirname}/app-dev.html`);
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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

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
