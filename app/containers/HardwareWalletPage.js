// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
import HardwareView from '../components/Hardware'
import HardwareSelectView from '../components/HardwareSelect'
import CompleteView from '../components/Complete'
import PageWrapper from '../containers/PageWrapper'
import { remote } from 'electron'

type Props = {};

function mapStateToProps(state) {
  return {
  	name: state.wallet.name,
    address: state.wallet.address,
    publicKey: state.wallet.publicKey,
    payload: state.wallet.payload
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

const VIEWS = {
  DEFAULT: 0,
  SELECT: 1,
  COMPLETE: 2,
}

class HardwareWalletPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
      name: '',
      error: null
    }
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  getTrezorAddress = () => {
  	this.props.updateName(name)
  		.then(() => this.props.getTrezorAddr())
  		.then(() => this.props.generatePayload(this.props.name, this.props.publicKey))
  		.then(() => this.changeView(VIEWS.COMPLETE))
  }

  getLedgerAddress = () => {
  	this.props.updateName(name)
  		.then(() => this.props.getLedgerAddr())
  		.then(() => this.props.generatePayload(this.props.name, this.props.publicKey))
  		.then(() => this.changeView(VIEWS.COMPLETE))
  }

  confirmSeed = (confirmSeed) => {
    if (confirmSeed === this.props.seed) {
    	this.props.generatePayload(this.props.name, this.props.publicKey)
    		.then(() => this.changeView(VIEWS.COMPLETE))
    } else {
      this.setState({
        error: 'The seed phrase you entered did not match!'
      })
    }
  }

  renderView(view) {
    switch(view) {
      case VIEWS.DEFAULT:
        return <HardwareView
        				name={this.state.name}
        				handleNameChange={this.handleNameChange}
                next={() => this.changeView(VIEWS.SELECT)}
               />;
      case VIEWS.SELECT:
        return <HardwareSelectView
                getTrezorAddress={this.getTrezorAddress}
                getLedgerAddress={this.getLedgerAddress}
               />;
      case VIEWS.COMPLETE:
        return <CompleteView
                address={this.props.address}
                payload={this.props.payload}
               />;
      default:
        return <HardwareView />;
    }
  }

  render() {
    return (
      <PageWrapper title="Hardware Wallet">
        {this.renderView(this.state.view)}
      </PageWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareWalletPage);
