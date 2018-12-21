/* eslint flowtype-errors/show-errors: 0 */
import React from "react";
import { Switch, Route } from "react-router";
import App from "@containers/app/index";
import TermsScreen from "@screens/onboarding/terms/index";
import InitialScreen from "@screens/onboarding/initial/index";
import WatchOnlyWalletScreen from "@screens/onboarding/watch-only/index";
import HardwareWalletScreen from "@screens/onboarding/hardware-wallet/index";
import Dashboard from "@screens/dashboard/index";
import TrezorPage from "@screens/onboarding/hardware-wallet/trezor";
import LedgerPage from "@screens/onboarding/hardware-wallet/ledger";
import { Transition } from "react-spring";
import {ROUTES} from "@common/constants";

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
