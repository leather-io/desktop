import { SettingsLayout } from './components/settings-layout';
import { SettingsAppearance } from './settings-appearance';
import { SettingsDiagnostics } from './settings-diagnostics';
import { SettingsManageNodes } from './settings-manage-nodes';
import { SettingsResetWallet } from './settings-reset-wallet';
import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';
import React from 'react';

export const Settings = () => {
  useBackButton(routes.HOME);

  return (
    <SettingsLayout>
      <SettingsManageNodes />
      <SettingsAppearance />
      <SettingsDiagnostics />
      <SettingsResetWallet />
    </SettingsLayout>
  );
};
