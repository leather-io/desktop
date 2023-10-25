import { App } from 'electron';
import path from 'path';

export function getUserDataPath(app: App) {
  // DO NOT CHANGE THIS TO LEATHER, WILL CAUSE BREAKING CHANGES
  const appId = 'so.hiro.StacksWallet';
  const appData = app.getPath('appData');
  const network = process.env.STX_NETWORK === 'mainnet' ? '' : 'Testnet';
  if (process.env.NODE_ENV === 'development') {
    const devName = `${appId}${network}Dev`;
    return path.join(appData, devName);
  }
  if (process.env.NODE_ENV === 'test') {
    const devName = `${appId}${network}Test`;
    return path.join(appData, devName);
  }
  const prodName = `${appId}${network}`;
  return path.join(appData, prodName);
}
