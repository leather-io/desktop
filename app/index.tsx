import React from 'react';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { render } from 'react-dom';

import { configureStore, history } from './store/configureStore';

const { store, persistor } = configureStore();

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Root = require('./pages/root').default;
  render(
    <ThemeProvider>
      <ColorModeProvider>
        <Root store={store} persistor={persistor} history={history} />
      </ColorModeProvider>
    </ThemeProvider>,
    document.getElementById('root')
  );
});
