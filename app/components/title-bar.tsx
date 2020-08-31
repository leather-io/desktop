import React, { useContext, FC } from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useLocation, matchPath } from 'react-router';
import { Flex, Box } from '@blockstack/ui';

import routes from '../constants/routes.json';
import { useWindowFocus } from '../hooks/use-window-focus';
import { BackContext } from '../pages/root';

import { NetworkMessage } from './network-message';
import { BackButton } from './back-button';

export const TitleBar: FC = () => {
  const el = document.querySelector('.draggable-bar');
  const location = useLocation();

  const { backUrl } = useContext(BackContext);
  const routerHistory = useHistory();
  const handleHistoryBack = () => {
    if (backUrl === null) return;
    routerHistory.push(backUrl);
  };
  const winState = useWindowFocus();

  const isOnboarding = matchPath(location.pathname, { path: '/onboard' }) !== null;
  const dulledTextColor = winState === 'blurred' ? '#A1A7B3' : undefined;

  if (!el) return null;

  const content = (
    <Flex
      justifyContent="space-between"
      pl="90px"
      height="100%"
      backgroundColor={winState === 'focused' ? 'white' : '#FAFAFC'}
    >
      <BackButton backUrl={backUrl} hasFocus={winState === 'focused'} onClick={handleHistoryBack} />
      <NetworkMessage textColor={dulledTextColor} />
      <Box>
        {!isOnboarding && (
          <Box
            as="button"
            onClick={() => routerHistory.push(routes.SETTINGS)}
            fontWeight="regular"
            style={{ color: dulledTextColor || '#677282' }}
            textStyle="body.small"
            p="tight"
            mt="4px"
            mr="tight"
            cursor="default"
            _focus={{ textDecoration: 'underline', outline: 0 }}
          >
            Settings
          </Box>
        )}
      </Box>
    </Flex>
  );
  return ReactDOM.createPortal(content, el);
};
