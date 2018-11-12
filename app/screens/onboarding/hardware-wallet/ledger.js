// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Box, Buttons } from "blockstack-ui/dist";
import { Button } from "@components/button/index";
import { Page } from "@components/page";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { ROUTES } from "../../../routes";
import { BitcoinIcon, NoEntryIcon, UsbIcon, LockIcon } from "mdi-react";
import { HardwareSteps } from "@containers/hardware-steps";

const steps = [
  {
    value: `Please connect your Ledger to your computer via USB.`,
    icon: UsbIcon
  },
  {
    value: "Unlock your Ledger by entering your PIN.",
    icon: LockIcon
  },
  {
    value: "Select the Bitcoin App on your Ledger.",
    icon: BitcoinIcon
  },
  {
    value: `Make sure you have "Browser Support" set to no.`,
    icon: NoEntryIcon
  }
];

const LedgerPage = ({ ...rest }) => (
  <Page alignItems="center" justifyContent="center" title="Connect your Ledger">
    <Flex width={1} flexDirection={"column"} maxWidth="600px">
      <Flex py={6} justifyContent="space-between" width={1}>
        <HardwareSteps steps={steps}>
          {({ step, next, hasNext, hasPrev, prev }) => (
            <OnboardingNavigation
              back={hasPrev ? prev : ROUTES.RESTORE_HARDWARE}
              next={hasNext ? next : ROUTES.DASHBOARD}
              nextLabel={hasNext ? "Next" : "Continue"}
            />
          )}
        </HardwareSteps>
      </Flex>
    </Flex>
  </Page>
);

export default LedgerPage;
