// @flow
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import * as WalletActions from "../actions/wallet";
import RestoreSeedView from "../components/RestoreSeed";
import CompleteView from "../components/Complete";
import PageWrapper from "../containers/PageWrapper";

type Props = {};

const mapStateToProps = state => ({
  name: state.wallet.name,
  seed: state.wallet.seed,
  address: state.wallet.address,
  publicKey: state.wallet.publicKey,
  payload: state.wallet.payload
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(WalletActions, dispatch);

const VIEWS = {
  DEFAULT: 0,
  COMPLETE: 1
};

class RestorePage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      view: VIEWS.DEFAULT,
      address: "",
      addressError: ""
    };
  }

  handleAddressPubKeyChange = event => {
    this.setState({
      address: event.target.value
    });
  };

  changeView = view => {
    this.setState({
      view: view
    });
  };

  restore = () => {
    if (this.state.address.length == 0) {
      this.setState({
        addressError: "Please enter an address or public key."
      });
    } else {
      this.props
        .restoreWatchOnly(this.state.address)
        .then(() => this.changeView(VIEWS.COMPLETE))
        .catch(error => {
          console.log(error);
          this.setState({
            addressError: "Failed to restore from the address you entered!"
          });
        });
    }
  };

  renderView(view) {
    switch (view) {
      case VIEWS.DEFAULT:
        return (
          <RestoreSeedView
            error={this.state.addressError}
            address={this.state.address}
            handleChange={this.handleAddressPubKeyChange}
            next={this.restore}
          />
        );
      case VIEWS.COMPLETE:
        return (
          <CompleteView
            address={this.props.address}
            publicKey={this.props.publicKey}
          />
        );
      default:
        return <div />;
    }
  }

  render() {
    return (
      <PageWrapper title="Restore Wallet">
        {this.renderView(this.state.view)}
      </PageWrapper>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestorePage);
