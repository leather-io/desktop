import React from 'react';
import toast from 'react-hot-toast';
import { Button, useColorMode } from '@stacks/ui';

import { SettingDescription } from './components/settings-layout';
import { SettingSection } from './components/settings-section';

export const SettingsAppearance = () => {
  const { colorMode } = useColorMode();

  return (
    <SettingSection title="Theme">
      <SettingDescription>
        You're currently using the {colorMode} theme. <br />{' '}
        <Button
          mt="base"
          onClick={() => {
            void main.theme.setSystemMode();
            toast('Using system color mode');
          }}
        >
          Use system color mode
        </Button>
      </SettingDescription>
    </SettingSection>
  );
};
