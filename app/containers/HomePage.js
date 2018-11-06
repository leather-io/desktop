// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import Terms from '../components/Terms';
import { remote } from 'electron'
import * as WalletActions from '../actions/wallet'

type Props = {};

function mapStateToProps(state) {
  return {
    termsAccepted: state.wallet.termsAccepted,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

const VIEWS = {
  DEFAULT: 0,
  TERMS: 1,
}

class HomePage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: this.props.termsAccepted ? VIEWS.DEFAULT : VIEWS.TERMS
    }
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  handleAccept = () => {
    this.props.acceptTerms()
  	this.changeView(VIEWS.DEFAULT)
  }

  handleQuit = () => {
  	const currentWindow = remote.getCurrentWindow()
  	currentWindow.close()
  }

  renderView(view) {
    switch(view) {
      case VIEWS.TERMS:
        return <Terms 
        					quit={this.handleQuit}
        					next={this.handleAccept}
        				/>;
      case VIEWS.DEFAULT:
        return <Home />;
      default:
        return <div></div>;
    }
  }

  render() {
  	return this.renderView(this.state.view)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);