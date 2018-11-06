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
  SELECT: 0,
  TREZOR: 1,
  LEDGER: 2,
  COMPLETE: 3
}

class HardwareWalletPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.SELECT,
      name: '',
      nameError: '',
      hardwareError: '',
      processing: false
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
      processing: true
    })
    this.props.getTrezorAddr()
  		// .then(() => this.props.generatePayload(this.props.name, this.props.publicKey))
      .then(({stacksAddress, btcAddress}) => this.props.setupWallet(stacksAddress, btcAddress, 'trezor'))
  		.then(() => {
        this.changeView(VIEWS.COMPLETE)
        this.setState({
          processing: false
        })
      })
      .catch(() => {
        this.setState({
          hardwareError: 'There was an error retrieving the public key from your Trezor.',
          processing: false
        })
      })
  }

  getLedgerAddress = () => {
    this.setState({
      hardwareError: '',
      processing: true
    })
    this.props.getLedgerAddr()
  		// .then(() => this.props.generatePayload(this.props.name, this.props.publicKey))
      .then(({stacksAddress, btcAddress}) => { 
        return this.props.setupWallet(stacksAddress, btcAddress, 'ledger')
      })
  		.then(() => {
        this.changeView(VIEWS.COMPLETE)
        this.setState({
          processing: false
        })
      })
      // .catch(() => {
      //   this.setState({
      //     hardwareError: 'There was an error retrieving the public key from your Ledger.',
      //     processing: false
      //   })
      // })
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
      case VIEWS.SELECT:
        return <HardwareSelectView
                getTrezorAddress={() => this.changeView(VIEWS.TREZOR)}
                getLedgerAddress={() => this.changeView(VIEWS.LEDGER)}
               />;
      case VIEWS.TREZOR:
        return <TrezorView
                getTrezorAddress={this.getTrezorAddress}
                processing={this.state.processing}
                error={this.state.hardwareError}
                back={() => this.changeView(VIEWS.SELECT)}
               />;
      case VIEWS.LEDGER:
        return <LedgerView
                getLedgerAddress={this.getLedgerAddress}
                processing={this.state.processing}
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
      <PageWrapper title="New Wallet">
        {this.renderView(this.state.view)}
      </PageWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HardwareWalletPage);
