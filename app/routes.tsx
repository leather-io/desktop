import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useStore } from 'react-redux';
import * as Sentry from '@sentry/react';

import routes from './constants/routes.json';
import { Home } from './pages/home/home';
import { selectSignedIn, selectPublicKey } from '@store/keys';

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
import { initSegment } from '@utils/init-segment';
import { Unlock } from './pages/Unlock';

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
  {
    path: routes.UNLOCK,
    component: Unlock,
  },
];

const getAppStartingRoute = (publicKey: Buffer | null, signedIn: boolean) => {
  if (!signedIn) {
    return routes.TERMS;
  }
  if (!publicKey) {
    return routes.UNLOCK;
  }
  return routes.HOME;
};

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

  const signedIn = selectSignedIn(store.getState());
  const publicKey = selectPublicKey(store.getState());
  return (
    <App>
      <Switch>
        {routerConfig.map((route, i) => (
          <Route key={i} exact {...route} />
        ))}
      </Switch>
      <Redirect to={getAppStartingRoute(publicKey, signedIn)} />
    </App>
  );
}
