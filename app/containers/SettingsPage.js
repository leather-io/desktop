// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
import Settings from '../components/Settings'
import { config, network } from 'blockstack'
import PageWrapper from '../containers/PageWrapper'
import bip39 from 'bip39'
import { remote } from 'electron'

type Props = {};

function mapStateToProps(state) {
  return {
    btcAddress: state.wallet.btcAddress,
    btcBalance: state.wallet.btcBalance
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

const VIEWS = {
  DEFAULT: 0,
}

class SettingsPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
    }
  }

  componentDidMount = () => {
    this.updateBtcBalance()
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  updateBtcBalance = () => {
    this.props.getBtcBalance(this.props.btcAddress)
  }

  reset = () => {
    this.props.eraseData()
  }

  renderView(view) {
    switch(view) {
      case VIEWS.DEFAULT:
        return <Settings
        				btcAddress={this.props.btcAddress}
                btcBalance={this.props.btcBalance}
                reset={this.reset}
               />;
      default:
        return <div></div>;
    }
  }

  render() {
    return (
      <PageWrapper title="Settings">
        {this.renderView(this.state.view)}
      </PageWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
