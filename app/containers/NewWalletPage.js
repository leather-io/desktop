// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
import NameInputView from '../components/NameInput'
import ViewSeedView from '../components/ViewSeed'
import ConfirmSeedView from '../components/ConfirmSeed'
import CompleteView from '../components/Complete'
import PageWrapper from '../containers/PageWrapper'
import { remote } from 'electron'

type Props = {};

function mapStateToProps(state) {
  return {
  	name: state.wallet.name,
    seed: state.wallet.seed,
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
  SEED: 1,
  CONFIRM: 2,
  COMPLETE: 3,
}

class NewWalletPage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
      name: '',
      nameError: '',
      confirmError: ''

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

  generateNewSeedWithName = () => {
  	const name = this.state.name
    if (name.length === 0) {
      this.setState({
        nameError: 'You must enter a name.'
      })
    } else {
      this.setState({
        nameError: ''
      })
	  	this.props.updateName(name)
	  		.then(() => this.props.generateNewSeed())
	  		.then(() => this.changeView(VIEWS.SEED))
    }
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
        confirmError: 'The seed phrase you entered did not match!'
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
        return <NameInputView
        				name={this.state.name}
        				error={this.state.nameError}
        				handleNameChange={this.handleNameChange}
                next={this.generateNewSeedWithName}
               />;
      case VIEWS.SEED:
        return <ViewSeedView
                seed={this.props.seed}
                next={this.showConfirmView}
                back={() => this.changeView(VIEWS.DEFAULT)}
               />;
      case VIEWS.CONFIRM:
        return <ConfirmSeedView
                error={this.state.confirmError}
                next={this.confirmSeed}
                back={() => this.changeView(VIEWS.SEED)}
               />;
      case VIEWS.COMPLETE:
        return <CompleteView 
                address={this.props.address}
                payload={this.props.payload}
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

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletPage);
