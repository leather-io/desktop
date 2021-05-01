import React, { FC } from 'react';

import { useListenSystemThemeChange } from '@hooks/use-listen-system-theme-change';
import { useGlobalAppPolling } from '@hooks/use-global-polling';
import { useWatchStackingTx } from '@hooks/use-watch-stacking-tx';

import { VersionInfo } from '@components/version-info';
import { TitleBar } from '@components/title-bar/title-bar';

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
