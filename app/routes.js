/* eslint flowtype-errors/show-errors: 0 */
import React from "react";
import { Switch, Route } from "react-router";
import App from "./containers/App";
import TermsScreen from "@screens/onboarding/terms";
import InitialScreen from "@screens/onboarding/initial";
import WatchOnlyWalletScreen from "@screens/onboarding/watch-only";
import HardwareWalletScreen from "@screens/onboarding/hardware-wallet";
import Dashboard from "@screens/dashboard";
import TrezorPage from "@screens/onboarding/hardware-wallet/trezor";
import LedgerPage from "@screens/onboarding/hardware-wallet/ledger";
import { Transition } from "react-spring";
export const ROUTES = {
  TERMS: "/",
  DASHBOARD: "/dashboard",
  RESTORE_OPTIONS: "/restore-options",
  RESTORE_HARDWARE: "/restore-hardware",
  RESTORE_LEDGER: "/restore-ledger",
  RESTORE_TREZOR: "/restore-trezor",
  RESTORE_WATCH: "/restore-watch"
};

export default () => (
  <App>
    <Switch>
      <Route path={ROUTES.RESTORE_OPTIONS} exact component={InitialScreen} />
      <Route
        path={ROUTES.RESTORE_WATCH}
        exact
        component={WatchOnlyWalletScreen}
      />
      <Route
        path={ROUTES.RESTORE_HARDWARE}
        exact
        component={HardwareWalletScreen}
      />
      <Route path={ROUTES.RESTORE_TREZOR} exact component={TrezorPage} />
      <Route path={ROUTES.RESTORE_LEDGER} exact component={LedgerPage} />
      <Route path={ROUTES.TERMS} exact component={TermsScreen} />
      <Route path={ROUTES.DASHBOARD} exact component={Dashboard} />
    </Switch>
  </App>
);
