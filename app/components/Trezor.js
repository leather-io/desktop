// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActionButtons from '../containers/ActionButtons'
import Button from '../containers/Button'
import StyledInput from '../components/Input'

type Props = {};

export default class Trezor extends Component<Props> {
  props: Props;

  render() {

    const { 
      getTrezorAddress,
      processing,
      error
    } = this.props

    return (
      <div>
        {error && <StyledInput.ErrorText>{error}</StyledInput.ErrorText>}
        <p>
          1. Make sure you have Trezor Bridge installed on your computer.
        </p>
        <p>
          2. Connect your Trezor to your computer via USB.
        </p>
        <p>
          3. Click the Next button.
        </p>
        <ActionButtons>
          <Button onClick={this.props.back}>Back</Button>
          <Button onClick={this.props.getTrezorAddress} disabled={processing}>{processing ? 'Processing...' : 'Next'}</Button>
        </ActionButtons>
      </div>
    );
  }
}
