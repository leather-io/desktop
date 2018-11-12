// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Box, Buttons } from "blockstack-ui/dist";
import { Link } from "react-router-dom";
import { Page } from "@components/page";
import { LedgerLogo } from "@components/svg/ledger";
import { TrezorLogo } from "@components/svg/trezor";
import { Hover } from "react-powerplug";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { ROUTES } from "../../../routes";

const Item = ({ title, icon: Icon, subtitle, to, ...rest }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Box
        width={0.48}
        is={Link}
        to={to}
        style={{
          textDecoration: "none"
        }}
        transform={hovered ? "translateY(-5px)" : "none"}
        transition={"0.5s all cubic-bezier(.19,1,.22,1)"}
        {...bind}
      >
        <Flex
          bg="white"
          width={1}
          flexDirection="column"
          borderRadius={12}
          alignItems={"center"}
          py={6}
          px={4}
          justifyContent={"center"}
          color="blue.dark"
          {...rest}
        >
          <Icon />
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pt={4}
        >
          <Type fontWeight="400" fontFamily="brand" fontSize={3} pb={1}>
            {title}
          </Type>
          <Type color="hsl(242, 56%, 75%)" fontSize={1}>
            {subtitle}
          </Type>
        </Flex>
      </Box>
    )}
  </Hover>
);

export default class RestoreSeed extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
  }

  render() {
    const { address, error, handleChange, next } = this.props;

    return (
      <Page
        alignItems="center"
        justifyContent="center"
        title="Select your Hardware Wallet"
      >
        <Flex width={1} flexDirection={"column"} maxWidth="600px">
          <Flex py={6} justifyContent="space-between" width={1}>
            <Item
              title="Trezor Wallet"
              icon={TrezorLogo}
              subtitle="Trezor One or Model T"
              to={ROUTES.RESTORE_TREZOR}
            />
            <Item
              title="Ledger Wallet"
              icon={LedgerLogo}
              subtitle="Nano S and Blue"
              to={ROUTES.RESTORE_LEDGER}
            />
          </Flex>
          <OnboardingNavigation back={ROUTES.RESTORE_OPTIONS} />
        </Flex>
      </Page>
    );
  }
}
