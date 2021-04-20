import { HomeSelectors } from './home.selectors';

import type { Page } from 'playwright';

import { createTestSelector } from '../integration-helpers';

const homeSelectors = {
  stxAddressText: createTestSelector(HomeSelectors.TextStxAddress),
  sendStxBtn: createTestSelector(HomeSelectors.BtnSend),
  sendStxFormAddressInput: createTestSelector(HomeSelectors.InputSendStxFormAddress),
  sendStxFormAmountInput: createTestSelector(HomeSelectors.InputSendStxFormAmount),
  sendStxFormMemoInput: createTestSelector(HomeSelectors.InputSendStxFormMemo),
  sendStxFormPreviewBtn: createTestSelector(HomeSelectors.BtnSendStxFormPreview),
  sendStxFormSendBtn: createTestSelector(HomeSelectors.BtnSendStxFormSend),
  sendStxFormBroadcastBtn: createTestSelector(HomeSelectors.BtnSendStxFormBroadcastTx),
  decryptWalletInput: createTestSelector(HomeSelectors.InputDecryptWallet),
  receiveStxBtn: createTestSelector(HomeSelectors.BtnReceive),
  receiveStxPasswordInput: createTestSelector(HomeSelectors.InputReceiveStxAddressPassword),
  revealStxAddressBtn: createTestSelector(HomeSelectors.BtnRevealStxAddress),
  receiveStxModalCloseBtn: createTestSelector(HomeSelectors.BtnReceiveStxModalClose),
};

export class HomeFeature {
  select = homeSelectors;

  constructor(public page: Page) {}

  $(key: keyof typeof homeSelectors) {
    return this.page.$(homeSelectors[key]);
  }

  async waitFor(key: keyof typeof homeSelectors) {
    await this.page.waitForSelector(homeSelectors[key]);
  }

  async click(key: keyof typeof homeSelectors) {
    await this.page.click(homeSelectors[key]);
  }

  async fillPasswordInput(text: string) {
    const input = await this.page.$(this.select.receiveStxPasswordInput);
    if (input === null) throw new Error('Input element not defined');
    await input.type(text);
  }
}
