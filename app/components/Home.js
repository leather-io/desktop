// @flow
import React, { Component } from 'react';
import styled from 'styled-components'
import Button from '../containers/Button'
import PageWrapper from '../containers/PageWrapper'

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <PageWrapper title="Stacks Wallet">
        <Button to="/new">New Wallet</Button>
        <Button to="/hardware">Use Hardware Wallet</Button>
        <Button to="/multisig">Use Multi-signature Wallet</Button>
      </PageWrapper>
    );
  }
}
