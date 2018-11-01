// @flow
import React, { Component } from "react";
import { remote } from "electron";
import Home from "../components/Home";
import Terms from "../components/Terms";

type Props = {};

const VIEWS = {
  DEFAULT: 0,
  TERMS: 1
};

export default class HomePage extends Component<Props> {
  props: Props;

  state = {
    view: global.termsAccepted ? VIEWS.DEFAULT : VIEWS.TERMS
  };

  changeView = view => {
    this.setState({
      view
    });
  };

  handleAccept = () => {
    global.termsAccepted = true;
    this.changeView(VIEWS.DEFAULT);
  };

  handleQuit = () => {
    const currentWindow = remote.getCurrentWindow();
    currentWindow.close();
  };

  renderView(view) {
    switch (view) {
      case VIEWS.TERMS:
        return <Terms quit={this.handleQuit} next={this.handleAccept} />;
      case VIEWS.DEFAULT:
        return <Home />;
      default:
        return <div />;
    }
  }

  render() {
    return this.renderView(this.state.view);
  }
}
