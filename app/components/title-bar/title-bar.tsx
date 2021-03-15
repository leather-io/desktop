import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useLocation, matchPath } from 'react-router';
import { Flex, Box } from '@blockstack/ui';

import routes from '@constants/routes.json';
import { useWindowFocus } from '@hooks/use-window-focus';
import { useCheckForUpdates } from '@hooks/use-check-for-updates';
import { openExternalLink } from '@utils/external-links';

import { NetworkMessage } from './network-message';
import { BackButton } from '../back-button';
import { SettingsButton } from './settings-button';
import { UpdateAvailableButton } from './update-available-button';

export const TitleBar: FC = () => {
  const el = document.querySelector('.draggable-bar');
  const location = useLocation();

  const routerHistory = useHistory();

  const winState = useWindowFocus();

  const { isNewerReleaseAvailable, latestRelease } = useCheckForUpdates();

  const isOnboarding = matchPath(location.pathname, { path: '/onboard' }) !== null;
  const dulledTextColor = winState === 'blurred' ? '#a1a7b3' : undefined;

  if (!el) return null;

  const content = (
    <Flex
      justifyContent="space-between"
      pl={process.platform === 'darwin' ? '90px' : 'tight'}
      height="100%"
      backgroundColor={winState === 'focused' ? 'white' : '#fafafc'}
    >
      <BackButton />
      <Flex
        justifyContent="space-around"
        flex={1}
        // Manages absolute centre alignment of content
        position={['relative', 'absolute']}
        left={[null, '130px']}
        right={[null, '130px']}
        height="100%"
      >
        <Flex>
          {isNewerReleaseAvailable && latestRelease && (
            <UpdateAvailableButton
              windowState={winState}
              onClick={() => openExternalLink('https://www.hiro.so/wallet/install-desktop')}
            />
          )}
          <Flex alignItems="center" ml="base">
            <NetworkMessage textColor={dulledTextColor} />
          </Flex>
        </Flex>
      </Flex>
      <Box>
        {!isOnboarding && (
          <SettingsButton
            onClick={() => routerHistory.push(routes.SETTINGS)}
            style={{ color: dulledTextColor || '#677282' }}
          />
        )}
      </Box>
    </Flex>
  );
  return ReactDOM.createPortal(content, el);
};
