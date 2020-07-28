import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createGlobalStyle } from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { CSSReset } from '@blockstack/ui';

import { Store } from '../store';
import { Routes } from '../routes';
import { loadFonts } from '../utils/load-fonts';
import { NetworkMessage } from '../components/network-message';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    min-height: 100vh;
    max-height: 100vh;
  }
`;

interface RootProps {
  store: Store;
  history: History;
}

function Root({ store, history }: RootProps) {
  useEffect(() => void loadFonts(), []);

  return (
    <Provider store={store}>
      <CSSReset />
      <GlobalStyle />
      <NetworkMessage />
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
}

export default hot(Root);
