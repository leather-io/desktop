// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import Input from '../containers/Input'

type Props = {};

export default class HardwareSelectView extends Component<Props> {
  props: Props;

  render() {
    const {
      name
    } = this.props

    return (
      <div>
        <Button 
          onClick={this.props.getTrezorAddress}
          height={68} 
          margin={'0 0 1px 0'}>
          Get address from Trezor
        </Button>
        <Button 
          onClick={this.props.getLedgerAddress}
          height={68} 
          margin={'0 0 1px 0'}>
          Get address from Ledger
        </Button>
        <ActionButtons>
          <Button onClick={this.props.back}>Back</Button>
        </ActionButtons>
      </div>
    );
  }
}
