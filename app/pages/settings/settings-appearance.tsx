import { SettingDescription } from './components/settings-layout';
import { SettingSection } from './components/settings-section';
import { Button, useColorMode } from '@stacks/ui';
import React from 'react';
import toast from 'react-hot-toast';

export const SettingsAppearance = () => {
  const { colorMode } = useColorMode();

  return (
    <SettingSection title="Theme">
      <SettingDescription>
        You&apos;re currently using the {colorMode} theme. <br />{' '}
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
