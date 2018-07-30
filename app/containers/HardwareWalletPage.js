// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
import NameInput from '../components/NameInput'
import HardwareSelectView from '../components/HardwareSelect'
import TrezorView from '../components/Trezor'
import LedgerView from '../components/Ledger'
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
  TREZOR: 2,
  LEDGER: 3,
  COMPLETE: 4
}

class HardwareWalletPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
      name: '',
      nameError: '',
      hardwareError: ''
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

  showHardwareSelectView = () => {
    const name = this.state.name
    if (name.trim().length === 0) {
      this.setState({
        nameError: 'You must enter a name.'
      })
    } else {
      this.setState({
        nameError: ''
      })
      this.props.updateName(name)
        .then(() => this.changeView(VIEWS.SELECT))
    }
  }

  getTrezorAddress = () => {
    this.setState({
      hardwareError: '',
    })
    this.props.getTrezorAddr()
  		.then(() => this.props.generatePayload(this.props.name, this.props.publicKey))
  		.then(() => this.changeView(VIEWS.COMPLETE))
      .catch(() => {
        this.setState({
          hardwareError: 'There was an error retrieving the public key from your Trezor.'
        })
      })
  }

  getLedgerAddress = () => {
    this.setState({
      hardwareError: '',
    })
    this.props.getLedgerAddr()
  		.then(() => this.props.generatePayload(this.props.name, this.props.publicKey))
  		.then(() => this.changeView(VIEWS.COMPLETE))
      .catch(() => {
        this.setState({
          hardwareError: 'There was an error retrieving the public key from your Ledger.'
        })
      })
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

  exit = () => {
    this.props.eraseSeed()
    const currentWindow = remote.getCurrentWindow()
    currentWindow.close()
  }

  renderView(view) {
    switch(view) {
      case VIEWS.DEFAULT:
        return <NameInput
        				name={this.state.name}
                error={this.state.nameError}
        				handleNameChange={this.handleNameChange}
                next={this.showHardwareSelectView}
               />;
      case VIEWS.SELECT:
        return <HardwareSelectView
                getTrezorAddress={() => this.changeView(VIEWS.TREZOR)}
                getLedgerAddress={() => this.changeView(VIEWS.LEDGER)}
                back={() => this.changeView(VIEWS.DEFAULT)}
               />;
      case VIEWS.TREZOR:
        return <TrezorView
                getTrezorAddress={this.getTrezorAddress}
                error={this.state.hardwareError}
                back={() => this.changeView(VIEWS.SELECT)}
               />;
      case VIEWS.LEDGER:
        return <LedgerView
                getLedgerAddress={this.getLedgerAddress}
                error={this.state.hardwareError}
                back={() => this.changeView(VIEWS.SELECT)}
               />;
      case VIEWS.COMPLETE:
        return <CompleteView
                address={this.props.address}
                payload={this.props.payload}
                publicKey={this.props.publicKey}
                next={this.exit}
               />;
      default:
        return <div></div>;
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
