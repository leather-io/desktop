// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Buttons } from "blockstack-ui/dist";
import { Page } from "@components/page";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { ROUTES } from "../../../routes";

type Props = {};

const Item = ({ title, body, ...rest }) => (
  <Flex width={0.45} flexDirection="column" {...rest}>
    <Type fontWeight="500" fontSize={2} pb={3}>
      {title}
    </Type>
    <Type lineHeight={1.5} fontSize={1} color="hsl(242, 56%, 75%)">
      {body}
    </Type>
  </Flex>
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
        title="Create a Watch Only Wallet"
      >
        <Flex flexDirection={"column"} maxWidth="600px">
          <Type lineHeight={1.5} fontSize={2} pt={6} color="hsl(242, 56%, 75%)">
            For your security, at this time you can only create a watch-only
            wallet if you do not have a hardware wallet device.
          </Type>
          <Flex py={6} justifyContent="space-between">
            <Item
              title="Public Key"
              body="This has been provided to you during the nullam bibendum quis
              neque vel gravida."
            />
            <Item
              title="Single Address"
              body="This has been provided to you during the nullam bibendum quis
              neque vel gravida."
            />
          </Flex>
          <Input
            variant="dark"
            type="textarea"
            name="address"
            value={address}
            error={error}
            onChange={handleChange}
            autoFocus
          />
          <Flex flexGrow={1} mt="auto" />
          <OnboardingNavigation
            back={ROUTES.RESTORE_OPTIONS}
            next={ROUTES.DASHBOARD}
          />
        </Flex>
      </Page>
    );
  }
}
