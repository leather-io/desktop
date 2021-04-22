import { _electron } from 'playwright';
import path from 'path';

jest.setTimeout(15_000);

export function setUpElectronApp() {
  return _electron.launch({
    args: [path.join(__dirname, '..', 'main.prod.js')],
  });
}
