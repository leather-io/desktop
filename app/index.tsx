import React, { Fragment } from 'react';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { DefaultOptions, QueryClient, QueryClientProvider } from 'react-query';

import { configureStore, history } from './store/configureStore';
import { DEFAULT_POLLING_INTERVAL } from './constants';

const config: DefaultOptions['queries'] = {
  refetchInterval: DEFAULT_POLLING_INTERVAL,
  keepPreviousData: true,
  refetchOnWindowFocus: true,
  staleTime: 30_000,
};

const queryClient = new QueryClient({
  defaultOptions: { queries: config },
});

const { store, persistor } = configureStore();

const AppContainer = CONFIG.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Root = require('./pages/root').default;
  render(
    <ThemeProvider>
      <ColorModeProvider defaultMode="light">
        <QueryClientProvider client={queryClient}>
          <AppContainer>
            <Root store={store} persistor={persistor} history={history} />
          </AppContainer>
        </QueryClientProvider>
      </ColorModeProvider>
    </ThemeProvider>,
    document.getElementById('root')
  );
});
