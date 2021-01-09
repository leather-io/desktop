const { notarize } = require('electron-notarize');
const { appId } = require('../electron-builder.js');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: `${String(appId)}`,
    appPath: `${String(appOutDir)}/${String(appName)}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASS,
  });
};
