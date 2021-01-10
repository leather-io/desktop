import fs from 'fs';
import path from 'path';
import { App } from 'electron';

export function validateConfig(app: App) {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  fs.readFile(configPath, 'utf8', (err, walletConfigText) => {
    if (err) return;
    try {
      JSON.parse(walletConfigText);
    } catch (e) {
      console.log('Backing up wallet');
      const now = new Date().toISOString();
      const corruptFilePath = path.join(
        app.getPath('userData'),
        `corrupt-wallet-backup-${now}.txt`
      );
      fs.writeFile(corruptFilePath, walletConfigText, err => {
        if (err) return;
      });
    }
  });
}
