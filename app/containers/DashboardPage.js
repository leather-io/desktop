// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../store/actions/wallet'
import Send from '../components/Send'
import { config, network } from 'blockstack'

import Dashboard from '../components/Dashboard'
import PageWrapper from '../containers/PageWrapper'
import bip39 from 'bip39'
import { remote } from 'electron'

type Props = {};

function mapStateToProps(state) {
  return {
    stacksBalance: state.wallet.stacksBalance,
    btcBalance: state.wallet.btcBalance,
    address: state.wallet.address,
    publicKey: state.wallet.publicKey,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

const VIEWS = {
  DEFAULT: 0,
  SEED: 1,
  COMPLETE: 2,
}

class SendPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
    }
  }

  componentDidMount = () => {
    this.updateBalance()
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  updateBalance = () => {
    this.props.getStacksBalance(this.props.address)
  }

  renderView(view) {
    switch(view) {
      case VIEWS.DEFAULT:
        return <Dashboard
        				address={this.props.address}
                stacksBalance={this.props.stacksBalance}
                btcBalance={1000}
               />;
      default:
        return <div></div>;
    }
  }

  render() {
    return (
      <PageWrapper>
        {this.renderView(this.state.view)}
      </PageWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendPage);
