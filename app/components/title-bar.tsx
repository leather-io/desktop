import React, { FC, useContext } from 'react';
import ReactDOM from 'react-dom';
import { matchPath, useHistory, useLocation } from 'react-router';
import { Box, color, Flex, Stack } from '@stacks/ui';
import { ColorModeButton } from '@components/color-mode-button';
import routes from '@constants/routes.json';
import { useWindowFocus } from '@hooks/use-window-focus';
import { BackContext } from '../pages/root';

import { NetworkMessage } from './network-message';
import { BackButton } from './back-button';

export const TitleBar: FC = () => {
  const el = document.querySelector('.draggable-bar');
  const location = useLocation();

  const { backUrl } = useContext(BackContext);
  const routerHistory = useHistory();
  const handleHistoryBack = () => {
    if (!backUrl) return;
    routerHistory.push(backUrl);
  };
  const winState = useWindowFocus();

  const isOnboarding = matchPath(location.pathname, { path: '/onboard' }) !== null;
  const dulledTextColor = winState === 'blurred' ? '#A1A7B3' : undefined;

  if (!el) return null;

  const content = (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      pl="90px"
      height="100%"
      backgroundColor={color('bg')}
    >
      <BackButton hasFocus={winState === 'focused'} onClick={handleHistoryBack} />
      <NetworkMessage textColor={dulledTextColor} />
      <Stack pr="extra-loose" alignItems="center" isInline spacing="base">
        <ColorModeButton />
        {!isOnboarding && (
          <Box
            as="button"
            onClick={() => routerHistory.push(routes.SETTINGS)}
            fontWeight="regular"
            style={{ color: dulledTextColor || '#677282' }}
            textStyle="body.small"
            color={color('text-caption')}
            _hover={{ color: color('accent') }}
            cursor="default"
            _focus={{ textDecoration: 'underline', outline: 0 }}
          >
            Settings
          </Box>
        )}
      </Stack>
    </Flex>
  );
  return ReactDOM.createPortal(content, el);
};
