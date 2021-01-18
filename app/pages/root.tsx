import React, { useEffect, useState, createContext } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createGlobalStyle } from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { History } from 'history';
import { PersistGate } from 'redux-persist/integration/react';
import { CSSReset } from '@blockstack/ui';

import { Store } from '@store/index';
import { Routes } from '../routes';
import { loadFonts } from '@utils/load-fonts';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    min-height: 100vh;
    max-height: 100vh;
    background: white;
  }
  #root {
    padding-top: 44px;
  }
  .draggable-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
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
  persistor: any;
}

export interface BackContextType {
  backUrl: null | string | (() => void);
  setBackUrl(url: null | string | (() => void)): void;
}

export const BackContext = createContext<BackContextType>({
  backUrl: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setBackUrl: (_url: string | (() => void)) => {},
});

function Root({ store, history, persistor }: RootProps) {
  const [backUrl, setBackUrl] = useState<string | (() => void) | null>(null);

  useEffect(() => void loadFonts(), []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BackContext.Provider value={{ backUrl, setBackUrl }}>
          <CSSReset />
          <GlobalStyle />
          <ConnectedRouter history={history}>
            <Routes />
          </ConnectedRouter>
        </BackContext.Provider>
      </PersistGate>
    </Provider>
  );
}

// eslint-disable-next-line import/no-default-export
export default hot(Root);
