import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useStore } from 'react-redux';
import { Button, ArrowIcon } from '@blockstack/ui';

import routes from './constants/routes.json';
import { Home } from './pages/home/home';
import { selectAddress } from './store/keys/keys.reducer';

import {
  Welcome,
  CreateWallet,
  RestoreWallet,
  GeneratingSecret,
  ConnectLedger,
  SecretKey,
  SaveKey,
  VerifyKey,
  SetPassword,
} from './pages/onboarding';
<<<<<<< HEAD
=======
import { BackContext } from './pages/root';
import { BackButton } from './components/back-button';
>>>>>>> refactor: break TitleBar, BackButton into components

export const routerConfig = [
  {
    path: routes.HOME,
    component: Home,
  },
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
    path: routes.CONNECT_LEDGER,
    component: ConnectLedger,
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
  {
    path: routes.SET_PASSWORD,
    component: SetPassword,
  },
];

const getAppStartingRoute = (address?: string) => (!!address ? routes.HOME : routes.WELCOME);

export function Routes() {
  // `useStore` required as we only want the value on initial render
  const store = useStore();
  const address = selectAddress(store.getState());
  return (
    <>
      <Switch>
        {routerConfig.map((route, i) => (
          <Route key={i} exact {...route} />
        ))}
      </Switch>
      <Redirect exact from="/" to={getAppStartingRoute(address)} />
    </>
  );
}
