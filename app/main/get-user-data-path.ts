import { App } from 'electron';
import path from 'path';

export function getUserDataPath(app: App) {
  const appId = 'so.hiro.StacksWallet';
  const appData = app.getPath('appData');
  const network = process.env.STX_NETWORK === 'mainnet' ? '' : 'Testnet';
  if (process.env.NODE_ENV === 'development') {
    const devName = `${appId}${network}Dev`;
    return path.join(appData, devName);
  }
  const prodName = `${appId}${network}`;
  return path.join(appData, prodName);
}
