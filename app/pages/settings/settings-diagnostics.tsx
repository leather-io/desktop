import React, { memo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Box, Flex, Text } from '@stacks/ui';

import { SettingDescription } from './components/settings-layout';
import { SettingSection } from './components/settings-section';
import {
  grantDiagnosticsPermission,
  revokeDiagnosticPermission,
  useHasUserGivenDiagnosticPermissions,
} from '@store/settings';

export const SettingsDiagnostics = memo(() => {
  const dispatch = useDispatch();
  const hasGivenPermission = useHasUserGivenDiagnosticPermissions();

  const updateDiagnosticPermissions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const diagnosticsEnabled = e.target.checked;
    toast(
      <div style={{ textAlign: 'center' }}>
        {diagnosticsEnabled ? 'Diagnostics enabled' : 'Diagnostics disabled'}
        <br />
        Restart to apply changes
      </div>
    );
    dispatch(diagnosticsEnabled ? grantDiagnosticsPermission() : revokeDiagnosticPermission());
    main.setDiagnosticPermission(diagnosticsEnabled);
  };

  return (
    <SettingSection title="Diagnostics">
      <SettingDescription>
        Anonymous diagnostic information helps us improve the Hiro Wallet
        <Flex as="label" textStyle="body.small" mt="base">
          <Box mr="tight" mt="1px">
            <input
              type="checkbox"
              defaultChecked={!!hasGivenPermission}
              onChange={e => updateDiagnosticPermissions(e)}
            />
          </Box>
          <Text userSelect="none">Enable diagnostics</Text>
        </Flex>
      </SettingDescription>
    </SettingSection>
  );
});
