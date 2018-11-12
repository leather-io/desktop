// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
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
    btcAddress: state.wallet.btcAddress,
    stacksTransactions: state.wallet.stacksTransactions,
    publicKey: state.wallet.publicKey,
    walletType: state.wallet.walletType
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
    this.refresh()
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  refresh = () => {
    this.updateBalance()
    this.updateTransactionHistory()
  }

  updateBalance = () => {
    // config.network.blockstackAPIUrl = 'http://localhost:6270'
    this.props.getStacksBalance(this.props.address)
    this.props.getBtcBalance(this.props.btcAddress)
  }

  updateTransactionHistory = () => {
    this.props.getTransactionHistory(this.props.address)
  }

  logout = () => {
    this.props.eraseData()
  }

  renderView(view) {
    switch(view) {
      case VIEWS.DEFAULT:
        return <Dashboard
        				address={this.props.address}
                stacksBalance={this.props.stacksBalance}
                transactions={this.props.stacksTransactions}
                refresh={this.refresh}
                logout={this.logout}
                walletType={this.props.walletType}
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
