import type { Page } from 'playwright';

import { delay } from '../../utils/delay';
import { createTestSelector } from '../integration-helpers';
import { createOnboardingFeature } from './onboarding.feature';
import { createSettingsFeature } from './settings.feature';

export function createGlobalFeature(page: Page) {
  return {
    settingsPageSelector: createTestSelector('btn-settings'),

    findSettingsBtn() {
      return page.$(this.settingsPageSelector);
    },
  };
}

export async function resetWallet(page: Page) {
  const settingsFeature = createSettingsFeature(page);

  //
  // Settings steps
  await page.waitForSelector(createTestSelector('btn-settings'));

  await page.screenshot({
    path: `screenshots/${String(process.env.STX_NETWORK)}-01-reset-wallet.png`,
  });

  const settingsButton = await page.$(createTestSelector('btn-settings'));
  if (!settingsButton) throw new Error('Should be defined');
  await settingsButton.click();

  const openResetWalletModalBtn = await settingsFeature.findOpenResetModalBtn();
  if (!openResetWalletModalBtn) throw new Error('Should be defined');
  await openResetWalletModalBtn.click();

  await page.screenshot({
    path: `screenshots/${String(process.env.STX_NETWORK)}-02-reset-wallet.png`,
  });

  const resetWalletButton = await page.$('[data-test="btn-reset-wallet"]');
  if (!resetWalletButton) throw new Error('Should be defined.');
  await resetWalletButton.click();
  await delay(4000);

  await page.screenshot({
    path: `screenshots/${String(process.env.STX_NETWORK)}-03-reset-wallet.png`,
  });

  // Reset should return to Tos page
  const onboarding = createOnboardingFeature(page);
  return onboarding.findTermsOfServiceTitle();
}
