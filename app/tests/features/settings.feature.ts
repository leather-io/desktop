import { createTestSelector } from '../integration-helpers';
import { SettingsSelectors } from './settings.selectors';
import type { Page } from 'playwright';

export function createSettingsFeature(page: Page) {
  return {
    findOpenResetModalBtn() {
      return page.$(createTestSelector(SettingsSelectors.BtnOpenResetModal));
    },
    findResetWalletBtn() {
      return page.$(createTestSelector(SettingsSelectors.BtnResetWallet));
    },
  };
}
