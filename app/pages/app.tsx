import { TitleBar } from '@components/title-bar/title-bar';
import { VersionInfo } from '@components/version-info';
import { useGlobalAppPolling } from '@hooks/use-global-polling';
import { useListenSystemThemeChange } from '@hooks/use-listen-system-theme-change';
import { useWatchStackingTx } from '@hooks/use-watch-stacking-tx';
import React, { FC } from 'react';

export const App: FC = ({ children }) => {
  useGlobalAppPolling();
  useWatchStackingTx();
  useListenSystemThemeChange();

  return (
    <>
      <TitleBar />
      {children}
      <VersionInfo />
    </>
  );
};
