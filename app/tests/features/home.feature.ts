import type { Page } from 'playwright';

import { createTestSelector } from '../integration-helpers';

// export enum HomeFeatureSelectors {
//   stxAddressText = 'text-stx-address',
//   sendStxBtn = 'btn-send',
//   sendStxFormAddressInput = 'input-send-stx-form-address',
//   sendStxFormAmountInput = 'input-send-stx-form-amount',
//   sendStxFormMemoInput = 'input-send-stx-form-memo',
//   sendStxFormPreviewBtn = 'btn-send-stx-form-preview',
//   sendStxFormSendBtn = 'btn-send-stx-form-send',
//   sendStxFormBroadcastBtn = 'btn-send-stx-form-broadcast-tx',
//   decryptWalletInput = 'input-decrypt-wallet',
//   receiveStxBtn = 'btn-receive',
//   receiveStxPasswordInput = 'input-receive-stx-address',
//   revealStxAddressBtn = 'btn-reveal-stx-address',
//   receiveStxModalCloseBtn = 'btn-receive-stx-modal-close',
// }

const homeSelectors = {
  stxAddressText: createTestSelector('text-stx-address'),
  sendStxBtn: createTestSelector('btn-send'),
  sendStxFormAddressInput: createTestSelector('input-send-stx-form-address'),
  sendStxFormAmountInput: createTestSelector('input-send-stx-form-amount'),
  sendStxFormMemoInput: createTestSelector('input-send-stx-form-memo'),
  sendStxFormPreviewBtn: createTestSelector('btn-send-stx-form-preview'),
  sendStxFormSendBtn: createTestSelector('btn-send-stx-form-send'),
  sendStxFormBroadcastBtn: createTestSelector('btn-send-stx-form-broadcast-tx'),
  decryptWalletInput: createTestSelector('input-decrypt-wallet'),
  receiveStxBtn: createTestSelector('btn-receive'),
  receiveStxPasswordInput: createTestSelector('input-receive-stx-address-password'),
  revealStxAddressBtn: createTestSelector('btn-reveal-stx-address'),
  receiveStxModalCloseBtn: createTestSelector('btn-receive-stx-modal-close'),
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
