/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import NewWallet from './containers/NewWalletPage';

export default () => (
  <App>
    <Switch>
    	<Route path="/new" component={NewWallet} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);