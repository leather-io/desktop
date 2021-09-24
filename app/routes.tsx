import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useStore } from 'react-redux';
import * as Sentry from '@sentry/react';

import routes from './constants/routes.json';
import { Home } from './pages/home/home';
import { selectAddress } from './store/keys/keys.reducer';

import {
  Terms,
  Welcome,
  CreateWallet,
  RestoreWallet,
  GeneratingSecret,
  ConnectLedger,
  SecretKey,
  VerifyKey,
  SetPassword,
} from './pages/onboarding';

import { App } from './pages/app';
import { Settings } from './pages/settings/settings';
import { DirectStacking } from './pages/stacking/direct-stacking/direct-stacking';
import { ChooseStackingMethod } from './pages/start-stacking/start-stacking';
import { StackingDelegation } from './pages/stacking/delegated-stacking/pooled-stacking';
import { useHasUserGivenDiagnosticPermissions } from '@store/settings';
import { Diagnostics } from './pages/onboarding/01-diagnostics/diagnostics';

let diagnosticsEnabled = false;

if (process.env.SENRTY_DSN) {
  Sentry.init({
    dsn: process.env.SENRTY_DSN,
    beforeSend(event) {
      if (!diagnosticsEnabled) return null;
      return event;
    },
  });
}

Sentry.setContext('network', { network: process.env.STX_NETWORK });

export const routerConfig = [
  {
    path: routes.HOME,
    component: Home,
  },
  {
    path: routes.HOME_REQUEST_DIAGNOSTICS,
    component: Home,
  },
  {
    path: routes.TERMS,
    component: Terms,
  },
  {
    path: routes.REQUEST_DIAGNOSTICS,
    component: Diagnostics,
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
  {
    path: routes.SETTINGS,
    component: Settings,
  },
  {
    path: routes.CHOOSE_STACKING_METHOD,
    component: ChooseStackingMethod,
  },
  {
    path: routes.DELEGATED_STACKING,
    component: StackingDelegation,
  },
  {
    path: routes.STACKING,
    component: DirectStacking,
  },
];

const getAppStartingRoute = (address?: string) => (!!address ? routes.HOME : routes.TERMS);

export function Routes() {
  // `useStore` required as we only want the value on initial render
  const store = useStore();
  const diagnosticPermission = useHasUserGivenDiagnosticPermissions();

  useEffect(() => {
    diagnosticsEnabled = !!diagnosticPermission;
  }, [diagnosticPermission]);

  const address = selectAddress(store.getState());
  return (
    <App>
      <Switch>
        {routerConfig.map((route, i) => (
          <Route key={i} exact {...route} />
        ))}
      </Switch>
      <Redirect to={getAppStartingRoute(address)} />
    </App>
  );
}
