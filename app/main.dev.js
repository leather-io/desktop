/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, shell } from "electron";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS
} from "electron-devtools-installer";

import path from "path";
import MenuBuilder from "./menu";

process.on("uncaughtException", err => {
  console.log("error");
  console.log(err);
});

let mainWindow = null;

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

// const installExtensions = async () => {
//   await installExtension(REACT_DEVELOPER_TOOLS, true);
//   await installExtension(REDUX_DEVTOOLS, true);
// };

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  app.quit();
});

app.on("ready", async () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    // await installExtensions();
  }

  // const nodeIntegration = process.env.NODE_ENV === "development";

  mainWindow = new BrowserWindow({
    show: false,
    width: 950,
    height: 760,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      // nodeIntegration: nodeIntegration,
      preload: path.join(__dirname, "preload.js")
    }
  });
  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on("did-finish-load", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on("new-window", function(event, url) {
    if (!url.startsWith("https://connect.trezor.io")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
