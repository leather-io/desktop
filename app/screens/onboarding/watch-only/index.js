// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Buttons } from "blockstack-ui/dist";
import { Page } from "@components/page";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { ROUTES } from "../../../routes";
import { Field } from "@components/field";
import { validateStxAddress } from "@utils/validation";
import { withRouter } from "react-router-dom";
import { Spinner } from "@components/spinner";
import { connect } from "react-redux";

import {
  doAddWatchOnlyAddress,
  doFetchStxAddressData
} from "@stores/reducers/wallet";

type Props = {};

const Loading = ({ message = "Fetching Wallet Details...", ...rest }) => (
  <Flex
    position="absolute"
    width="100%"
    height="100%"
    left={0}
    top={0}
    alignItems="center"
    justifyContent="center"
    zIndex={9999}
    flexDirection="column"
    {...rest}
  >
    <Spinner size={80} />
    <Flex pt={6}>
      <Type fontWeight={500} color="blue.mid" opacity={0.5}>
        {message}
      </Type>
    </Flex>
  </Flex>
);

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

class WatchOnlyScreen extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
  }

  state = {
    value: "",
    error: null,
    loading: false
  };

  handleChange = event => {
    const value = event.target.value;
    if (value !== this.state.value) {
      this.setState(state => ({
        value
      }));
    }
  };

  handleLoading = addr => {
    this.props.doAddWatchOnlyAddress(addr);
    this.props.doFetchStxAddressData(addr);
    // setTimeout(() => {
    //   this.props.history.push(ROUTES.DASHBOARD);
    // }, 1200);
  };

  handleValidation = () => {
    this.setState({
      error: ""
    });
    const valid = validateStxAddress(this.state.value);
    if (valid) {
      this.setState({
        valid,
        loading: true
      });
      this.handleLoading(this.state.value);
    } else {
      this.setState({
        error: "Stacks address seems invalid."
      });
    }
  };

  handleSubmit = () => {
    if (this.state.value === "") {
      this.setState({
        error: "Please enter a Stacks Address"
      });
      return null;
    }
    this.handleValidation();
  };

  render() {
    const { address, error, handleChange, next } = this.props;

    return (
      <Page
        alignItems="center"
        justifyContent="center"
        title="Create a Watch Only Wallet"
      >
        {this.state.loading ? <Loading bg="blue.dark" /> : null}
        <Flex flexDirection={"column"} maxWidth="600px">
          <Type lineHeight={1.5} fontSize={2} pt={6} color="hsl(242, 56%, 75%)">
            For your security, at this time you can only create a watch-only
            wallet if you do not have a hardware wallet device. Please enter a
            Stacks Address.
          </Type>
          <Flex pt={4}>
            <Field
              variant="dark"
              name="address"
              value={address}
              error={this.state.error}
              onChange={this.handleChange}
              label="Stacks Address"
              autoFocus
              placeholder="Enter Stacks Address"
            />
          </Flex>
          <Flex flexGrow={1} mt="auto" />
          <OnboardingNavigation
            back={ROUTES.RESTORE_OPTIONS}
            next={this.handleSubmit}
          />
        </Flex>
      </Page>
    );
  }
}

export default connect(
  null,
  {
    doAddWatchOnlyAddress,
    doFetchStxAddressData
  }
)(withRouter(WatchOnlyScreen));
