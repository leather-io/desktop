import React from "react";
import { Flex, Box } from "blockstack-ui/dist";
import { Page } from "@components/page";
import { HardwareSteps } from "@containers/hardware-steps";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { UsbIcon } from "mdi-react";
import { doAddHardwareWallet } from "@stores/actions/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { Notice } from "@components/notice";
import { connect } from "react-redux";
import { TextLink } from "@containers/buttons/onboarding-navigation";
import { shell } from "electron";
import { TrezorNote } from "@components/trezor-note";

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
        <Flex
          py={6}
          justifyContent="space-between"
          flexDirection="column"
          width={1}
        >
          <Notice mb={6} dark>
            Make sure you have{" "}
            <TextLink
              onClick={() =>
                shell.openExternal("https://wallet.trezor.io/#/bridge")
              }
              px={1}
              onDark
              pt={0}
              fontSize="1rem"
            >
              Trezor Bridge
            </TextLink>{" "}
            installed.
          </Notice>
          <HardwareSteps steps={trezorSteps}>
            {({ step, next, hasNext }) => (
              <>
                <OnboardingNavigation
                  onDark
                  back={"/restore-hardware"}
                  next={hasNext ? next : handleSubmit}
                />
              </>
            )}
          </HardwareSteps>
          <TrezorNote mt={4} textAlign="center" />
        </Flex>
      </Flex>
    </Page>
  );
});

export default TrezorPage;
