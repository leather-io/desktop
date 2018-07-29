// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import Terms from '../components/Terms';
import { remote } from 'electron'

type Props = {};

const VIEWS = {
  DEFAULT: 0,
  TERMS: 1,
}

export default class HomePage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props)

    this.state = {
      view: global.termsAccepted ? VIEWS.DEFAULT : VIEWS.TERMS
    }
  }

  changeView = (view) => {
    this.setState({
      view: view
    })
  }

  handleAccept = () => {
  	global.termsAccepted = true
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
