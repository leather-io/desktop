import React, { ReactNode, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useLocation, matchPath } from 'react-router';
import { Flex, Box } from '@blockstack/ui';

import { NetworkMessage } from '../components/network-message';
import { BackButton } from '../components/back-button';
import routes from '../constants/routes.json';
import { BackContext } from './root';
import { useWindowFocus } from '../hooks/use-window-focus';

function TitleBar({ children }: any) {
  const el = document.querySelector('.draggable-bar');
  if (!el) return null;
  return ReactDOM.createPortal(children, el);
}

interface Props {
  children: ReactNode;
}

export function App(props: Props) {
  const { children } = props;
  const { backUrl } = useContext(BackContext);
  const routerHistory = useHistory();

  const winState = useWindowFocus();

  const handleHistoryBack = () => {
    if (backUrl === null) return;
    routerHistory.push(backUrl);
  };

  const location = useLocation();

  const isOnboarding = matchPath(location.pathname, { path: '/onboard' }) !== null;

  return (
    <>
      <TitleBar>
        <Flex
          justifyContent="space-between"
          pl="90px"
          height="100%"
          backgroundColor={winState === 'focused' ? null : '#FAFAFC'}
        >
          <BackButton backUrl={backUrl} onClick={handleHistoryBack} />
          <NetworkMessage textColor={winState === 'blurred' ? '#A1A7B3' : undefined} />
          <Box>
            {!isOnboarding && (
              <Box
                as="button"
                onClick={() => routerHistory.push(routes.SETTINGS)}
                fontWeight="regular"
                style={{ color: '#677282' }}
                textStyle="body.small"
                p="tight"
                mt="4px"
                mr="tight"
                _hover={{ cursor: 'pointer' }}
                _focus={{ textDecoration: 'underline', outline: 0 }}
              >
                Settings
              </Box>
            )}
          </Box>
        </Flex>
      </TitleBar>
      {children}
    </>
  );
}
