/* eslint flowtype-errors/show-errors: 0 */
import React from "react";
import { Switch, Route } from "react-router";
import App from "@containers/app/index";
import TermsScreen from "@screens/onboarding/terms/index";
import InitialScreen from "@screens/onboarding/initial/index";
import NewScreen from "@screens/onboarding/new/index";
import RestoreScreen from "@screens/onboarding/restore/index";

import NewSeedScreen from "@screens/onboarding/new-seed/index";
import ConfirmSeedScreen from "@screens/onboarding/confirm-seed/index";
import RestoreSeedScreen from "@screens/onboarding/restore-seed/index";

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
      <Route path={ROUTES.SETUP} exact component={InitialScreen}/>
      <Route path={ROUTES.NEW_OPTIONS} exact component={NewScreen}/>
      <Route path={ROUTES.RESTORE_OPTIONS} exact component={RestoreScreen} />
      <Route path={ROUTES.NEW_SEED} exact component={NewSeedScreen}/>
      <Route path={ROUTES.CONFIRM_SEED} exact component={ConfirmSeedScreen}/>
      <Route path={ROUTES.RESTORE_SEED} exact component={RestoreSeedScreen}/>
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
