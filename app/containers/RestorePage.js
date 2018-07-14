// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as WalletActions from '../actions/wallet'
import NameInputView from '../components/NameInput'
import ViewSeedView from '../components/ViewSeed'
import RestoreSeedView from '../components/RestoreSeed'
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
  COMPLETE: 2,
}

class RestorePage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.DEFAULT,
      name: '',
      seed: '',
      nameError: '',
      seedError: ''

    }
  }

  handleNameChange = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  handleSeedChange = (event) => {
    this.setState({
      seed: event.target.value
    })
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  nextWithName = () => {
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
	  		.then(() => this.changeView(VIEWS.SEED))
    }
  }

  restore = () => {
    this.props.restoreFromSeed(this.state.seed)
      .then(() => this.props.generatePayload(this.props.name, this.props.publicKey))
      .then(() => this.changeView(VIEWS.COMPLETE))
      .catch((error) => {
        console.log(error)
        this.setState({
          seedError: 'Failed to restore from the seed phrase you entered!'
        })
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
        return <NameInputView
        				name={this.state.name}
        				error={this.state.nameError}
        				handleNameChange={this.handleNameChange}
                next={this.nextWithName}
               />;
      case VIEWS.SEED:
        return <RestoreSeedView
                error={this.state.seedError}
                seed={this.state.seed}
                handleChange={this.handleSeedChange}
                next={this.restore}
                back={() => this.changeView(VIEWS.DEFAULT)}
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
      <PageWrapper title="Restore Wallet">
        {this.renderView(this.state.view)}
      </PageWrapper>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RestorePage);
