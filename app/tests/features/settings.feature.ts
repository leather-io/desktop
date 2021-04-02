import type { Page } from 'playwright';
import { createTestSelector } from '../integration-helpers';

export function createSettingsFeature(page: Page) {
  return {
    findOpenResetModalBtn() {
      return page.$(createTestSelector('btn-open-reset-modal'));
    },
    findResetWalletBtn() {
      return page.$(createTestSelector('btn-reset-wallet'));
    },
  };
}
