import { _electron, ElectronApplication, Page } from 'playwright';

import { whenNetwork } from '../utils/network-utils';

import { setUpElectronApp } from './_setup-tests';
import { createGlobalFeature, resetWallet } from './features/global.feature';
import { HomeFeature } from './features/home.feature';
import { initSoftwareWallet } from './features/onboarding.feature';

const PASSWORD = 'hello9*&^*^*dkfskjdfskljdfsj';
const SEED_PHRASE =
  'across okay clerk forum chief law around nuclear vacuum miss brown predict mushroom fix west quit mother afford bamboo neutral pioneer crime open call';

describe('Restore wallet flow', () => {
  let app: ElectronApplication;
  let page: Page;

  beforeAll(async () => {
    app = await setUpElectronApp();
    page = await app.firstWindow();
    await initSoftwareWallet(page)(SEED_PHRASE, PASSWORD);
  });

  afterAll(async () => await app.close());

  test('Restore wallet', async done => {
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

    expect(await stxAddressLabel.textContent()).toEqual(
      whenNetwork({
        testnet: 'ST28VRDJ3TMB268BRMZXTJJ6Q4PABH108QNY5BSK1',
        mainnet: 'SP28VRDJ3TMB268BRMZXTJJ6Q4PABH108QM9GH8JG',
      })
    );

    await homeFeature.click('receiveStxModalCloseBtn');

    const finishPageTosTitle = await resetWallet(page);
    await page.screenshot({ path: 'screenshots/finished-page.png' });
    expect(finishPageTosTitle).toBeTruthy();

    done();
  }, 120_0000);
});
