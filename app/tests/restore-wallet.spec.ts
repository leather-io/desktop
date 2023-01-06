import rimraf from 'rimraf';
import { _electron, ElectronApplication, Page } from 'playwright';

import { whenNetwork } from '../utils/network-utils';
import { delay } from '../utils/delay';

import { setUpElectronApp } from './_setup-tests';
import { getTestConfigPath } from './get-test-config-path';
import { createGlobalFeature, resetWallet } from './features/global.feature';
import { HomeFeature } from './features/home.feature';
import { initSoftwareWallet } from './features/onboarding.feature';

const PASSWORD = 'hello9*&^*^*dkfskjdfskljdfsj';
const SEED_PHRASE =
  'across okay clerk forum chief law around nuclear vacuum miss brown predict mushroom fix west quit mother afford bamboo neutral pioneer crime open call';

describe('Restore wallet flow', () => {
  let app: ElectronApplication;
  let page: Page;

  beforeEach(async () => {
    rimraf(`${getTestConfigPath()}/config.json`, err => {
      if (err) console.log('Issue deleting file');
    });
    app = await setUpElectronApp();
    page = await app.firstWindow();
  });

  async function takeScreenshot(name: string) {
    await page.screenshot({ path: `screenshots/${process.platform}/${name}.png` });
  }

  afterEach(async () => await app.close());

  test('Restore wallet', async () => {
    await initSoftwareWallet(page)(SEED_PHRASE, PASSWORD);

    const globalFeature = createGlobalFeature(page);

    //
    // Home steps
    const homeFeature = new HomeFeature(page);
    await page.waitForSelector(globalFeature.settingsPageSelector);

    await homeFeature.click('receiveStxBtn');

    await homeFeature.fillPasswordInput(PASSWORD);

    await homeFeature.click('revealStxAddressBtn');

    await homeFeature.waitFor('stxAddressText');
    const stxAddressLabel = await homeFeature.$('stxAddressText');
    if (!stxAddressLabel) throw new Error('Should be defined.');

    await takeScreenshot('restore-wallet-address');

    expect(await stxAddressLabel.textContent()).toEqual(
      whenNetwork({
        testnet: 'ST28VRDJ3TMB268BRMZXTJJ6Q4PABH108QNY5BSK1',
        mainnet: 'SP28VRDJ3TMB268BRMZXTJJ6Q4PABH108QM9GH8JG',
      })
    );

    await homeFeature.click('receiveStxModalCloseBtn');

    await takeScreenshot(`${String(process.env.STX_NETWORK)}-after-close-stx-modal.png`);

    await resetWallet(page);
    await delay(1000);
    await takeScreenshot('finished-page');
  }, 120_0000);
});
