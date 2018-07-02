// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
import MultiSigView from '../components/MultiSig'
import CompleteView from '../components/Complete'

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
  HARDWARE: 0,
  COMPLETE: 1,
}

class MultiSigWalletPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
      name: '',
      signaturesRequired: 0,
      publicKeys: ['', ''],
      error: null
    }
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  handlePubKeyChange = (event, index) => {
    var newPublicKeys = this.state.publicKeys
    newPublicKeys[index] = event.target.value
    this.setState({
      publicKeys: newPublicKeys
    })
  }

  handleSignaturesRequiredChange = (event) => {
    this.setState({
      signaturesRequired: parseInt(event.target.value)
    })
  }

  addPublicKey = () => {
    var newPublicKeys = this.state.publicKeys
    newPublicKeys.push('')
    this.setState({
      publicKeys: newPublicKeys
    })
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  makeMultiSig = () => {
    this.props.updateName(name)
      .then(() => this.props.makeMultiSig(this.state.publicKeys, this.state.signaturesRequired))
  		.then(({address, payload}) => this.props.generateMultiSigPayload(address, payload))
  		.then(() => this.changeView(VIEWS.COMPLETE))
  }

  showConfirmView = () => {
    this.changeView(VIEWS.CONFIRM)
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
        return <MultiSigView
        				name={this.state.name}
        				handleNameChange={this.handleNameChange}
                publicKeys={this.state.publicKeys}
                handlePubKeyChange={this.handlePubKeyChange}
                handleSignaturesRequiredChange={this.handleSignaturesRequiredChange}
                addPublicKey={this.addPublicKey}
                next={this.makeMultiSig}
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
      <div>
        <div>
          <h2>Multi-signature Wallet</h2>
          {this.renderView(this.state.view)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MultiSigWalletPage);
