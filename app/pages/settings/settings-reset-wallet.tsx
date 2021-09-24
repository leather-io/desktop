import React, { useState } from 'react';

import { Button, color, Text } from '@stacks/ui';

import { ResetWalletModal } from '@modals/reset-wallet/reset-wallet-modal';
import { useWalletType } from '@hooks/use-wallet-type';

import { SettingDescription } from './components/settings-layout';
import { SettingSection } from './components/settings-section';
import { SettingsSelectors } from 'app/tests/features/settings.selectors';

export const SettingsResetWallet = () => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const { whenWallet } = useWalletType();

  return (
    <SettingSection title="Reset wallet">
      <SettingDescription>
        When you reset your wallet, you will need to
        {whenWallet({
          software: ' sign back in with your 24-word Secret Key.',
          ledger: ' reauthenticate with your Ledger device',
        })}
        <br />
        <Text mt="base-tight" display="block" color="ink.600" textStyle="caption">
          Your wallet data can be found in: <code>{main.getUserDataPath()}</code>
        </Text>
      </SettingDescription>
      <ResetWalletModal isOpen={resetModalOpen} onClose={() => setResetModalOpen(false)} />

      <Button
        mt="loose"
        style={{ background: color('feedback-error') }}
        data-test={SettingsSelectors.BtnOpenResetModal}
        onClick={() => setResetModalOpen(true)}
      >
        Reset wallet
      </Button>
    </SettingSection>
  );
};
