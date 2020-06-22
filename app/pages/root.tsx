import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createGlobalStyle } from 'styled-components';
import { CSSReset, Box, Text } from '@blockstack/ui';
import { Link } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';

import { Store } from '../store';
import { Routes, routerConfig } from '../routes';
import { loadFonts } from '../utils/load-fonts';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }
`;

export function DevFooter() {
  return (
    <Box position="absolute" top="base" left="loose">
      {routerConfig.map((route, i) => (
        <Link key={i} to={route.path}>
          <Text mr="base" fontSize="12px">
            {route.component.name}
          </Text>
        </Link>
      ))}
    </Box>
  );
}

interface RootProps {
  store: Store;
  history: History;
}

function Root({ store, history }: RootProps) {
  useEffect(() => {
    void loadFonts();
  }, []);

  return (
    <Provider store={store}>
      <CSSReset />
      <GlobalStyle />
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
}

export default hot(Root);
