import type { Page } from 'playwright';

import { createTestSelector, repeatAction } from '../integration-helpers';
import { OnboardingSelector } from './onboarding.selectors';

export function createOnboardingFeature(page: Page) {
  return {
    findTermsOfServiceTitle() {
      return page.$('text=Terms of Service');
    },

    findAcceptBtn() {
      return page.$(createTestSelector(OnboardingSelector.BtnAcceptTerms));
    },

    findResoreWalletBtn() {
      return page.$(createTestSelector(OnboardingSelector.BtnRestoreWallet));
    },

    findSecretKeyInput() {
      return page.$(createTestSelector(OnboardingSelector.InputSecretKey));
    },

    findContinueWithSecretKeyBtn() {
      return page.$(createTestSelector(OnboardingSelector.BtnContinueWithKey));
    },

    findPasswordInput() {
      return page.$(createTestSelector(OnboardingSelector.InputPassword));
    },

    findContinueWithPasswordBtn() {
      return page.$(createTestSelector(OnboardingSelector.BtnContinueFromPassword));
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
