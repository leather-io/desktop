import { _electron, ElectronApplication, Page } from 'playwright';
import { deserializeTransaction, cvToValue } from '@stacks/transactions';

import { delay } from '../utils/delay';
import { stxToMicroStx } from '../utils/unit-convert';

import { createGlobalFeature, resetWallet } from './features/global.feature';
import { HomeFeature } from './features/home.feature';
import { initSoftwareWallet } from './features/onboarding.feature';
import { setUpElectronApp } from './_setup-tests';

const PASSWORD = 'hello9*&^*^*dkfskjdfskljdfsj';
const SEED_PHRASE =
  'area kid fat gaze foster eyebrow pen heart draft capable lecture attract daughter news glue saddle exact disorder win olive observe burst option wasp';
const TX_RECIPIENT = 'STWQ9GP5J69F07RX287ECZ8MRWV48C402HF8CBWB';
const TX_AMOUNT = Math.random().toFixed(6);
const TX_MEMO = 'test-memo-field000';

function interceptTransactionBroadcast(page: Page): Promise<Buffer> {
  return new Promise(resolve => {
    page.on('request', request => {
      if (request.url() === 'https://stacks-node-api.testnet.stacks.co/v2/transactions') {
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
    app = await setUpElectronApp();
    page = await app.firstWindow();
    await initSoftwareWallet(page)(SEED_PHRASE, PASSWORD);
  });

  afterAll(async () => {
    await resetWallet(page);
    await app.close();
  });

  test('Transaction form', async done => {
    const globalFeature = createGlobalFeature(page);

    //
    // Home steps
    const homeFeature = new HomeFeature(page);
    await page.waitForSelector(globalFeature.settingsPageSelector);

    await homeFeature.click('sendStxBtn');

    const addressInput = await page.$(homeFeature.select.sendStxFormAddressInput);
    await addressInput.type(TX_RECIPIENT);

    const amountInput = await page.$(homeFeature.select.sendStxFormAmountInput);
    await amountInput.type(TX_AMOUNT);

    const memoInput = await page.$(homeFeature.select.sendStxFormMemoInput);
    await memoInput.type(TX_MEMO);

    const previewTxBtn = await page.$(homeFeature.select.sendStxFormPreviewBtn);
    await previewTxBtn.click();

    await delay(1000);

    const memoPreview = await page.$(`text="${TX_MEMO}"`);
    expect(memoPreview).not.toBeNull();

    await homeFeature.waitFor('sendStxFormSendBtn');

    const stxFormSendBtn = await page.$(homeFeature.select.sendStxFormSendBtn);
    await stxFormSendBtn.click();

    await homeFeature.waitFor('decryptWalletInput');

    const decryptWalletPasswordInput = await page.$(homeFeature.select.decryptWalletInput);
    await decryptWalletPasswordInput.type(PASSWORD);

    const broadcastTxBtn = await page.$(homeFeature.select.sendStxFormBroadcastBtn);
    await broadcastTxBtn.click();

    const requestBody = await interceptTransactionBroadcast(page);

    const deserialisedTx = deserializeTransaction(requestBody);
    const payload = deserialisedTx.payload as any;
    const amount = payload.amount.toString();
    const recipient = cvToValue(payload.recipient);
    const memo = payload.memo.content.replace(/\0/g, '');

    expect(memo).toEqual(TX_MEMO);
    expect(recipient).toEqual(TX_RECIPIENT);
    expect(amount).toEqual(stxToMicroStx(TX_AMOUNT).toString());

    done();
  }, 120_0000);
});
