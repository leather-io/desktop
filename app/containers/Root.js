// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';
import { PersistGate } from 'redux-persist/integration/react'
import PageWrapper from '../containers/PageWrapper'

type Props = {
  store: {},
  history: {}
};

const loading = (<PageWrapper><div>Loading></div></PageWrapper>)

export default class Root extends Component<Props> {
  render() {
    return (
      <Provider store={this.props.store}>
        <PersistGate loading={loading} persistor={this.props.persistor}>
          <ConnectedRouter history={this.props.history}>
            <Routes />
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    );
  }
}
