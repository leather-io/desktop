// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Box, Buttons } from "blockstack-ui/dist";
import { Page } from "@components/page";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { ROUTES } from "@common/constants";
import { BitcoinIcon, NoEntryIcon, UsbIcon, LockIcon } from "mdi-react";
import { HardwareSteps } from "@containers/hardware-steps";
import { doAddHardwareWallet, doFetchBalances } from "@stores/actions/wallet";
import { selectWalletLoading } from "@stores/selectors/wallet";
import { WALLET_TYPES } from "@stores/reducers/wallet";
import { connect } from "react-redux";

export const ledgerSteps = [
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

export const LedgerSteps = connect(
  state => ({
    loading: selectWalletLoading(state)
  }),
  { doAddHardwareWallet }
)(({ doAddHardwareWallet, loading, ...rest }) => {
  const handleSubmit = () => {
    doAddHardwareWallet(WALLET_TYPES.LEDGER);
  };
  return (
    <HardwareSteps steps={ledgerSteps}>
      {({ step, next, hasNext, hasPrev, prev }) => (
        <OnboardingNavigation
          onDark
          back={hasPrev ? prev : ROUTES.RESTORE_HARDWARE}
          next={{
            action: hasNext ? next : handleSubmit,
            label: loading ? "Loading..." : hasNext ? "Next" : "Continue",
            props: {
              style: {
                pointerEvents: loading ? "none" : "unset"
              }
            }
          }}
        />
      )}
    </HardwareSteps>
  );
});

const LedgerPage = ({ style, ...rest }) => (
  <Page
    alignItems="center"
    justifyContent="center"
    title="Connect your Ledger"
    style={style}
  >
    <Flex width={1} flexDirection={"column"} maxWidth="600px">
      <Flex py={6} justifyContent="space-between" width={1}>
        <LedgerSteps />
      </Flex>
    </Flex>
  </Page>
);

export default LedgerPage;
