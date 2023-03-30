import path from 'path';
import rimraf from 'rimraf';

import { _electron, ElectronApplication, Page } from 'playwright';

import { deserializeTransaction, cvToValue } from '@stacks/transactions';
import { getUserDataPath } from '../main/get-user-data-path';

import { delay } from '../utils/delay';
import { stxToMicroStx } from '../utils/unit-convert';

import { createGlobalFeature } from './features/global.feature';
import { HomeFeature } from './features/home.feature';
import { initSoftwareWallet } from './features/onboarding.feature';
import { setUpElectronApp } from './_setup-tests';
import { getTestConfigPath } from './get-test-config-path';

const PASSWORD = 'hello9*&^*^*dkfskjdfskljdfsj';
// ST71MG1BZ1QDSHXT4GZ5H2FGFX24XKM2ND5GXPV6
const SEED_PHRASE =
  'area kid fat gaze foster eyebrow pen heart draft capable lecture attract daughter news glue saddle exact disorder win olive observe burst option wasp';
const TX_RECIPIENT = 'STWQ9GP5J69F07RX287ECZ8MRWV48C402HF8CBWB';
const TX_AMOUNT = Math.random().toFixed(6);
const TX_MEMO = 'test-memo-field000';

function interceptTransactionBroadcast(page: Page): Promise<Buffer> {
  return new Promise(resolve => {
    page.on('request', request => {
      if (request.url().endsWith('/v2/transactions')) {
        const requestBody = request.postDataBuffer();
        if (requestBody === null) return;
        resolve(requestBody);
      }
    });
  });
}

const describeOnlyTestnet = process.env.STX_NETWORK === 'testnet' ? describe : describe.skip;

describeOnlyTestnet('Transaction flow', () => {
  let app: ElectronApplication;
  let page: Page;

  beforeAll(async () => {
    rimraf(`${getTestConfigPath()}/config.json`, err => {
      if (err) console.log('Issue deleting file');
    });
    app = await setUpElectronApp();
    page = await app.firstWindow();
  });

  afterAll(async () => {
    await app.close();
  });

  async function takeScreenshot(name: string) {
    await page.screenshot({ path: `screenshots/${process.platform}/${name}.png` });
  }

  test('Transaction form', async done => {
    await initSoftwareWallet(page)(SEED_PHRASE, PASSWORD);
    const globalFeature = createGlobalFeature(page);

    //
    // Home steps
    const homeFeature = new HomeFeature(page);
    await page.waitForSelector(globalFeature.settingsPageSelector);

    await homeFeature.click('sendStxBtn');

    const addressInput = await page.$(homeFeature.select.sendStxFormAddressInput);
    if (!addressInput) throw new Error('Should be defined.');
    await addressInput.type(TX_RECIPIENT);

    const amountInput = await page.$(homeFeature.select.sendStxFormAmountInput);
    if (!amountInput) throw new Error('Should be defined.');
    await amountInput.type(TX_AMOUNT);

    const memoInput = await page.$(homeFeature.select.sendStxFormMemoInput);
    if (!memoInput) throw new Error('Should be defined.');
    await memoInput.type(TX_MEMO);

    const previewTxBtn = await page.$(homeFeature.select.sendStxFormPreviewBtn);
    if (!previewTxBtn) throw new Error('Should be defined.');
    await previewTxBtn.click();

    const memoPreview = await page.$(`text="${TX_MEMO}"`);
    if (!memoPreview) throw new Error('Should be defined.');
    expect(memoPreview).not.toBeNull();

    await takeScreenshot('after-form-complete');

    await homeFeature.waitFor('sendStxFormSendBtn');

    const stxFormSendBtn = await page.$(homeFeature.select.sendStxFormSendBtn);
    if (!stxFormSendBtn) throw new Error('Should be defined.');
    await stxFormSendBtn.click();

    await homeFeature.waitFor('decryptWalletInput');

    await takeScreenshot('decrypt-wallet');

    const decryptWalletPasswordInput = await page.$(homeFeature.select.decryptWalletInput);
    if (!decryptWalletPasswordInput) throw new Error('Should be defined.');
    await decryptWalletPasswordInput.type(PASSWORD);

    const broadcastTxBtn = await page.$(homeFeature.select.sendStxFormBroadcastBtn);
    if (!broadcastTxBtn) throw new Error('Should be defined.');
    await broadcastTxBtn.click();

    await takeScreenshot('sent');
    const requestBody = await interceptTransactionBroadcast(page);

    const deserialisedTx = deserializeTransaction(requestBody);
    const payload = deserialisedTx.payload as any;
    const amount = payload.amount.toString();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const recipient = cvToValue(payload.recipient);
    const memo = payload.memo.content.replace(/\0/g, '');

    expect(memo).toEqual(TX_MEMO);
    expect(recipient).toEqual(TX_RECIPIENT);
    expect(amount).toEqual(stxToMicroStx(TX_AMOUNT).toString());

    done();
  }, 120_0000);
});
