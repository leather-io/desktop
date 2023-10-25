/* eslint-disable @typescript-eslint/no-unsafe-argument */
import routes from './constants/routes.json';
import { App } from './pages/app';
import { Home } from './pages/home/home';
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
import { Diagnostics } from './pages/onboarding/01-diagnostics/diagnostics';
import { Settings } from './pages/settings/settings';
import { StackingDelegation } from './pages/stacking/delegated-stacking/pooled-stacking';
import { DirectStacking } from './pages/stacking/direct-stacking/direct-stacking';
import { ChooseStackingMethod } from './pages/start-stacking/start-stacking';
import { selectAddress } from './store/keys/keys.reducer';
import * as Sentry from '@sentry/react';
import { useHasUserGivenDiagnosticPermissions } from '@store/settings';
import { initSegment } from '@utils/init-segment';
import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

initSegment();

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

const getAppStartingRoute = (address?: string) => (address ? routes.HOME : routes.TERMS);

export function Routes() {
  // `useStore` required as we only want the value on initial render
  const store = useStore();
  const diagnosticPermission = useHasUserGivenDiagnosticPermissions();
  const [userDisabledDiagnosticsInCurrentSession, setUserDisabledDiagnosticsInCurrentSession] =
    useState(false);

  useEffect(() => {
    if (process.env.SENTRY_DSN && diagnosticPermission) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        beforeSend(event) {
          if (userDisabledDiagnosticsInCurrentSession) return null;
          return event;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUserDisabledDiagnosticsInCurrentSession(!diagnosticPermission);
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
