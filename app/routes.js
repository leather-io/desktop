/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Onboarding from './containers/OnboardingPage';

export default () => (
  <App>
    <Switch>
    	<Route path="/onboarding" component={Onboarding} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);