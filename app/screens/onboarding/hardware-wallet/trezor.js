import React, { Component } from "react";
import { Flex, Type, Input, Box, Buttons } from "blockstack-ui/dist";
import { Page } from "@components/page";
import { HardwareSteps } from "@containers/hardware-steps";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { UsbIcon } from "mdi-react";
import { doAddHardwareWallet, doFetchBalances } from "@stores/actions/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { connect } from "react-redux";
export const trezorSteps = [
  {
    value: `Please connect your Trezor to your computer via USB.`,
    icon: UsbIcon
  }
];
const TrezorPage = connect(
  null,
  { doAddHardwareWallet }
)(({ doAddHardwareWallet, style, ...rest }) => {
  const handleSubmit = () => {
    doAddHardwareWallet(WALLET_TYPES.TREZOR);
  };
  return (
    <Page
      alignItems="center"
      justifyContent="center"
      title="Connect your Trezor"
      style={style}
    >
      <Flex width={1} flexDirection={"column"} maxWidth="600px">
        <Flex py={6} justifyContent="space-between" width={1}>
          <HardwareSteps steps={trezorSteps}>
            {({ step, next, hasNext }) => (
              <OnboardingNavigation
                onDark
                back={"/restore-hardware"}
                next={hasNext ? next : handleSubmit}
              />
            )}
          </HardwareSteps>
        </Flex>
      </Flex>
    </Page>
  );
});

export default TrezorPage;
