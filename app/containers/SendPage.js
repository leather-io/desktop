// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
import Send from '../components/Send'
import SendConfirmation from '../components/SendConfirmation'
import SendError from '../components/SendError'
import SendBtcNeeded from '../components/SendBtcNeeded'
import SendComplete from '../components/SendComplete'
import { config, network } from 'blockstack'
import PageWrapper from '../containers/PageWrapper'
import bip39 from 'bip39'
import { remote } from 'electron'
import bigi from 'bigi'
import { stacksToMicro } from '../utils/utils'

type Props = {};

function mapStateToProps(state) {
  return {
    address: state.wallet.address,
    btcAddress: state.wallet.btcAddress,
    stacksBalance: state.wallet.stacksBalance,
    btcBalance: state.wallet.btcBalance,
    walletType: state.wallet.walletType,
    rawTransaction: state.wallet.rawTransaction
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

const VIEWS = {
  DEFAULT: 0,
  CONFIRMATION: 1,
  ERROR: 2,
  BTC: 3,
  COMPLETE: 4
}

class SendPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
      address: '',
      amount: '',
      addressError: '',
      amountError: '',
      rawTransaction: null,
      txID: '',
      error: ''
    }
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

  validate = () => {
    let valid = true;

    if (this.state.address == '') {
      this.setState({
        addressError: 'You must enter a valid recipient Stacks address.'
      })
      valid = false;
    }

    if (this.state.amount == '') {
      this.setState({
        amountError: 'You must enter a valid amount.'
      })
      valid = false;
    }
    else if (isNaN(this.state.amount)) {
      this.setState({
        amountError: 'Amount must be a number.'
      })
      valid = false;
    }
    else if (Number(this.state.amount) <= 0) {
      this.setState({
        amountError: 'Amount must be greater than 0.'
      })
      valid = false;
    }

    return valid
  }

  checkBalances = () => {
    let valid = true

    if (this.props.stacksBalance.compareTo(bigi.fromByteArrayUnsigned(stacksToMicro(this.state.amount).toString())) < 0) {
      this.setState({
        amountError: 'Amount exceeds available account balance.'
      })
      valid = false;
    } 
    else if (this.props.btcBalance.compareTo(bigi.valueOf(0)) <= 0) {
      valid = false;
      this.changeView(VIEWS.BTC)
    } 

    return valid
  }

  send = () => {
    // console.log(this.state.address)
    // console.log(this.state.amount)

    this.clearErrors()
    if (this.validate() && this.checkBalances()) {
      this.clearErrors()
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

      // this.changeView(VIEWS.CONFIRMATION)
      // this.changeView(VIEWS.COMPLETE)

      this.props.generateTransaction(senderAddress, recipientAddress, amount, walletType)
        .then((tx) => {
          console.log(tx)
          this.setState({
            rawTransaction: tx
          })
          this.changeView(VIEWS.CONFIRMATION)
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            error
          })
          this.changeView(VIEWS.ERROR)
        })
    }
  }

  confirmSend = () => {
    this.props.broadcastTransaction(this.props.rawTransaction)
      .then((txID) => {
        this.setState({
          txID: txID
        })
        this.changeView(VIEWS.COMPLETE)
      })
      .catch((error) => {
        console.log(error)
        this.setState({
          error
        })
        this.changeView(VIEWS.ERROR)
      })
  }

  clearErrors = () => {
    this.setState({
      addressError: '',
      amountError: '',
      error: ''
    })
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
        				address={this.state.address}
                amount={this.state.amount}
        				addressError={this.state.addressError}
                amountError={this.state.amountError}
        				handleAddressChange={this.handleAddressChange}
                handleAmountChange={this.handleAmountChange}
                next={this.send}
               />;
      case VIEWS.CONFIRMATION:
        return <SendConfirmation
                address={this.state.address}
                amount={this.state.amount}
                confirm={this.confirmSend}
               />;
      case VIEWS.ERROR:
        return <SendError
                error={this.state.error}
               />;
      case VIEWS.BTC:
        return <SendBtcNeeded
                btcAddress={this.props.btcAddress}
                minBtcAmount={0.0001}
                tryAgain={this.send}
               />;
      case VIEWS.COMPLETE:
        return <SendComplete 
                txID={this.state.txID}
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
