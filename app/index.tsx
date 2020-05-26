import React, { Fragment } from 'react';
import { ThemeProvider, theme } from '@blockstack/ui';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';

import Root from './pages/root';
import { configureStore, history } from './store/configureStore';

const store = configureStore();

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Root store={store} history={history} />
      </AppContainer>
    </ThemeProvider>,
    document.getElementById('root')
  )
);
