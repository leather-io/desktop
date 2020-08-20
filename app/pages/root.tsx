import React, { useEffect, useState, createContext } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createGlobalStyle } from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { CSSReset } from '@blockstack/ui';

import { Store } from '../store';
import { Routes } from '../routes';
import { loadFonts } from '../utils/load-fonts';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    min-height: 100vh;
    max-height: 100vh;
  }
  #root {padding-top: 44px;}
  .draggable-bar {
    position: absolute;
    height: 44px;
    width: 100%;
    z-index: 9;
    box-shadow: 0px 1px 2px rgba(15, 17, 23, 0.08);
    -webkit-user-select: none;
    -webkit-app-region: drag;
  }
`;

interface RootProps {
  store: Store;
  history: History;
}

interface BackContext {
  backUrl: null | string;
  setBackUrl(url: null | string): void;
}

export const BackContext = createContext<BackContext>({
  backUrl: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setBackUrl: (_url: string) => {},
});

function Root({ store, history }: RootProps) {
  const [backUrl, setBackUrl] = useState<string | null>(null);

  useEffect(() => void loadFonts(), []);

  return (
    <Provider store={store}>
      <BackContext.Provider value={{ backUrl, setBackUrl }}>
        <CSSReset />
        <GlobalStyle />
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </BackContext.Provider>
    </Provider>
  );
}

export default hot(Root);
