// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Box, Buttons } from "blockstack-ui/dist";
import { Page } from "@components/page";
import { HardwareSteps } from "@containers/hardware-steps";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { UsbIcon } from "mdi-react";

const steps = [
  {
    value: `Please connect your Trezor to your computer via USB.`,
    icon: UsbIcon
  }
];
const TrezorPage = ({ style, ...rest }) => (
  <Page alignItems="center" justifyContent="center" title="Connect your Trezor" style={style}>
    <Flex width={1} flexDirection={"column"} maxWidth="600px">
      <Flex py={6} justifyContent="space-between" width={1}>
        <HardwareSteps steps={steps}>
          {({ step, next, hasNext }) => (
            <OnboardingNavigation
              back={"/restore-hardware"}
              next={hasNext ? next : "/dashboard"}
            />
          )}
        </HardwareSteps>
      </Flex>
    </Flex>
  </Page>
);

export default TrezorPage;
