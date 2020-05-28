import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './pages/app';

import {
  Welcome,
  CreateWallet,
  RestoreWallet,
  GeneratingSecret,
  SecretKey,
  SaveKey,
  VerifyKey,
  SetPassword,
} from './pages/onboarding';

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
  {
    path: routes.GENERATING,
    component: GeneratingSecret,
  },
  {
    path: routes.SECRET_KEY,
    component: SecretKey,
  },
  {
    path: routes.SAVE_KEY,
    component: SaveKey,
  },
  {
    path: routes.VERIFY_KEY,
    component: VerifyKey,
  },
  {
    path: routes.SET_PASSWORD,
    component: SetPassword,
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
