/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import Home from './containers/HomePage';
import NewWallet from './containers/NewWalletPage';
import HardwareWallet from './containers/HardwareWalletPage';
import MultiSigWallet from './containers/MultiSigWalletPage';
import Restore from './containers/RestorePage';
import Send from './containers/SendPage';
import Dashboard from './containers/DashboardPage';

export default () => (
  <App>
    <Switch>
    	<Route path="/send" component={Send} />
      <Route path="/dashboard" component={Dashboard} />
    	<Route path="/new" component={NewWallet} />
    	<Route path="/hardware" component={HardwareWallet} />
    	<Route path="/multisig" component={MultiSigWallet} />
    	<Route path="/restore" component={Restore} />
      <Route path="/" component={Home} />
    </Switch>
  </App>
);