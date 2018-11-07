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
import Settings from './containers/SettingsPage';
import Dashboard from './containers/DashboardPage';
import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect'
import { routerActions } from 'react-router-redux'

const walletSetup = connectedReduxRedirect({
  redirectPath: '/setup',
  authenticatedSelector: state =>
    !!state.wallet.created,
  wrapperDisplayName: 'WalletCreated',
  redirectAction: routerActions.replace
})

export default () => (
  <App>
    <Switch>
    	<Route path="/new" component={NewWallet} />
    	<Route path="/hardware" component={HardwareWallet} />
    	<Route path="/multisig" component={MultiSigWallet} />
    	<Route path="/restore" component={Restore} />
      <Route path="/setup" component={Home} />
      <Route path="/settings" component={walletSetup(Settings)} />
      <Route path="/send" component={walletSetup(Send)} />
      <Route path="/" component={walletSetup(Dashboard)} />
    </Switch>
  </App>
);