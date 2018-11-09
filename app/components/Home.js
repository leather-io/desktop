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
      <PageWrapper title="Stacks Wallet" icon={iconImage} topPadding={105} center>
        <Input.SmallText>
          Choose one of the following options to setup your Stacks wallet.
        </Input.SmallText>
        <br/>
        <Button 
          to="/hardware" 
          height={68} 
          margin={'0 0 1px 0'}>
          Create wallet from hardware device
        </Button>
        <Button 
          to="/restore" 
          height={68} 
          margin={'0 0 1px 0'}>
          Create watch-only wallet
        </Button>
{/*       <Button 
          to="/new" 
          height={68} 
          margin={'0 0 1px 0'}>
          Create New Wallet
        </Button>
        <Button 
          to="/hardware" 
          height={68} 
          margin={'0 0 1px 0'}>
          Use a Hardware Wallet
        </Button>
        <Button 
          to="/multisig" 
          height={68}
          margin={'0 0 1px 0'}>
          Create Multi-Signature Wallet
        </Button>
        <Button 
          to="/restore" 
          height={68}
          margin={'0 0 1px 0'}>
          Restore from Seed Phrase
        </Button>
        <Button 
          to="/test" 
          height={68}>
          Test
        </Button>*/}
      </PageWrapper>
    );
  }
}
