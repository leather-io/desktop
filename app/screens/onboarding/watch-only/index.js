// @flow
import React, { Component } from "react";
import { Flex, Type, Input, Buttons } from "blockstack-ui/dist";
import { Page } from "@components/page";
import { OnboardingNavigation } from "@containers/buttons/onboarding-navigation";
import { ROUTES } from "../../../routes";
import { Field } from "@components/field";
import { validateStxAddress } from "@utils/validation";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { selectWalletLoading } from "@stores/selectors/wallet";
import {
  doAddWatchOnlyAddress,
  doFetchStxAddressData,
  doRefreshData
} from "@stores/actions/wallet";

type Props = {};

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
    this.props.doRefreshData(false);
    setTimeout(() => {
      this.props.history.push(ROUTES.DASHBOARD);
    }, 10);
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
    const {
      address,
      error,
      handleChange,
      next,
      loading,
      doAddWatchOnlyAddress,
      doRefreshData,
      ...rest
    } = this.props;

    return (
      <Page
        alignItems="center"
        justifyContent="center"
        title="Create a Watch Only Wallet"
        {...rest}
      >
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
  state => ({
    loading: selectWalletLoading(state)
  }),
  {
    doAddWatchOnlyAddress,
    doRefreshData
  }
)(withRouter(WatchOnlyScreen));
