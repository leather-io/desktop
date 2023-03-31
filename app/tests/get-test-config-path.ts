import os from 'os';
import path from 'path';

export function getTestConfigPath() {
  const appDir = `so.hiro.StacksWallet${String(
    process.env.STX_NETWORK === 'testnet' ? 'Testnet' : ''
  )}`;
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', appDir);
  }
  return path.join(os.homedir(), '.config', appDir);
}
