// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
import Send from '../components/Send'
import SendComplete from '../components/SendComplete'
import { config, network } from 'blockstack'
import PageWrapper from '../containers/PageWrapper'
import bip39 from 'bip39'
import { remote } from 'electron'

type Props = {};

function mapStateToProps(state) {
  return {
    address: state.wallet.address,
    btcAddress: state.wallet.btcAddress,
    walletType: state.wallet.walletType
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

const VIEWS = {
  DEFAULT: 0,
  COMPLETE: 1,
}

class SendPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
      address: '',
      amount: 0,
      nameError: '',
      seedError: ''

    }
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  handleAddressChange = (event) => {
    this.setState({
      address: event.target.value
    })
  }


  handleAmountChange = (event) => {
    this.setState({
      amount: event.target.value
    })
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  send = () => {
    console.log(this.state.address)
    console.log(this.state.amount)
    
    const senderAddress = this.props.address
    const recipientAddress = this.state.address 
    const amount = this.state.amount 
    const walletType = this.props.walletType

    // const key = "5d488f8e32bc906cff26d496e9bd27f8b371c91773273b44ae58978fd10651bb01"

    // const PUBLIC_TESTNET_HOST = 'testnet.blockstack.org';

    // const CONFIG = {
    //   blockstackAPIUrl: `http://${PUBLIC_TESTNET_HOST}:16268`,
    //   blockstackNodeUrl: `http://${PUBLIC_TESTNET_HOST}:16264`,
    //   broadcastServiceUrl: `http://${PUBLIC_TESTNET_HOST}:16269`,
    //   // utxoServiceUrl: `http://${PUBLIC_TESTNET_HOST}:18332`,
    //   logConfig: { level: 'debug' }
    // };

    // const blockstackNetwork = new network.LocalRegtest(
    //   CONFIG.blockstackAPIUrl, CONFIG.broadcastServiceUrl, 
    //   new network.BitcoindAPI(CONFIG.utxoServiceUrl,
    //     { username: 'blockstack', password: 'blockstacksystem' }))

    // config.network = blockstackNetwork;

    this.props.sendTokens(senderAddress, recipientAddress, amount, walletType)
    .then((res) => {
      console.log(res)
      this.changeView(VIEWS.COMPLETE)
    })
  }

  nextWithName = () => {
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
	  		.then(() => this.changeView(VIEWS.SEED))
    }
  }

  restore = () => {
    if (this.state.seed.length == 0) {
      this.setState({
        seedError: 'Please enter your seed phrase.'
      })
    } else {
      if (bip39.validateMnemonic(this.state.seed)) {
        this.props.restoreFromSeed(this.state.seed)
          .then(() => this.props.generatePayload(this.props.name, this.props.publicKey))
          .then(() => this.changeView(VIEWS.COMPLETE))
          .catch((error) => {
            console.log(error)
            this.setState({
              seedError: 'Failed to restore from the seed phrase you entered!'
            })
          })
      } else {
        this.setState({
          seedError: 'Please enter a valid seed phrase.'
        })
      }
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
        return <Send
        				address={this.state.name}
                amount={this.state.name}
        				error={this.state.nameError}
        				handleAddressChange={this.handleAddressChange}
                handleAmountChange={this.handleAmountChange}
                next={this.send}
               />;
      case VIEWS.COMPLETE:
        return <SendComplete 
                confirm={() => this.changeView(VIEWS.DEFAULT)}
        			 />;
      default:
        return <div></div>;
    }
  }

  render() {
    return (
      <PageWrapper title="Send Stacks">
        {this.renderView(this.state.view)}
      </PageWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendPage);
