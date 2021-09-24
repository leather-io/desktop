import React from 'react';

import routes from '@constants/routes.json';
import { useBackButton } from '@hooks/use-back-url';

import { SettingsLayout } from './components/settings-layout';
import { SettingsManageNodes } from './settings-manage-nodes';
import { SettingsAppearance } from './settings-appearance';
import { SettingsDiagnostics } from './settings-diagnostics';
import { SettingsResetWallet } from './settings-reset-wallet';

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
