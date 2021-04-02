import type { Page } from 'playwright';

import { createTestSelector, repeatAction } from '../integration-helpers';

export function createOnboardingFeature(page: Page) {
  return {
    findTermsOfServiceTitle() {
      return page.$('text=Terms of Service');
    },

    findAcceptBtn() {
      return page.$(createTestSelector('btn-accept-terms'));
    },

    findResoreWalletBtn() {
      return page.$(createTestSelector('btn-restore-wallet'));
    },

    findSecretKeyInput() {
      return page.$(createTestSelector('input-secret-key'));
    },

    findContinueWithSecretKeyBtn() {
      return page.$(createTestSelector('btn-continue-with-key'));
    },

    findPasswordInput() {
      return page.$(createTestSelector('input-password'));
    },

    findContinueWithPasswordBtn() {
      return page.$(createTestSelector('btn-continue-from-password'));
    },
  };
}

export function initSoftwareWallet(page: Page) {
  return async (seed: string, password: string) => {
    const onboarding = createOnboardingFeature(page);
    const termsOfServicePageTitle = await onboarding.findTermsOfServiceTitle();

    if (!termsOfServicePageTitle) {
      expect(termsOfServicePageTitle).toBeTruthy();
      throw new Error('Test not started in clean environment, loaded a `config.json`');
    }

    // Scroll down
    await repeatAction(1000)(() => page.keyboard.down('Space'));

    const button = await onboarding.findAcceptBtn();
    await button.click();

    const restoreWalletButton = await onboarding.findResoreWalletBtn();
    await restoreWalletButton.click();

    const input = await onboarding.findSecretKeyInput();
    await input.type(seed);

    const continueWithSecretKey = await onboarding.findContinueWithSecretKeyBtn();
    await continueWithSecretKey.click();

    const passwordInput = await onboarding.findPasswordInput();
    await passwordInput.type(password);

    const continueWithPassword = await onboarding.findContinueWithPasswordBtn();
    await continueWithPassword.click();
  };
}
