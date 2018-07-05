// @flow
import React, { Component } from 'react';
import styled from 'styled-components'
import Button from '../containers/Button'
import PageWrapper from '../containers/PageWrapper'
import Input from '../components/Input'
import iconImage from '../images/icon.png';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <PageWrapper title="Stacks Wallet" icon={iconImage} topPadding={145} center>
        <Input.SmallText>
          Choose one of the following options to setup your Stacks wallet.
        </Input.SmallText>
        <Button to="/new">New Wallet</Button>
        <Button to="/hardware">Use Hardware Wallet</Button>
        <Button to="/multisig">Use Multi-Signature Wallet</Button>
      </PageWrapper>
    );
  }
}
