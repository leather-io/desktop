import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './pages/app';

import { Welcome, CreateWallet, RestoreWallet } from './pages/onboarding';

export const routerConfig = [
  {
    path: routes.WELCOME,
    component: Welcome,
  },
  {
    path: routes.CREATE,
    component: CreateWallet,
  },
  {
    path: routes.RESTORE,
    component: RestoreWallet,
  },
];

export function Routes() {
  return (
    <App>
      <Switch>
        {routerConfig.map((route, i) => (
          <Route key={i} {...route} />
        ))}
      </Switch>
      <Redirect exact from="/" to={routes.WELCOME} />
    </App>
  );
}
