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
      error
    } = this.props

    return (
      <div>
        {error && <StyledInput.ErrorText>{error}</StyledInput.ErrorText>}
        <p>
          1. Connect your Trezor to your computer via USB.
        </p>
        <p>
          2. Click the Next button.
        </p>
        <ActionButtons>
          <Button onClick={this.props.back}>Back</Button>
          <Button onClick={this.props.getTrezorAddress}>Next</Button>
        </ActionButtons>
      </div>
    );
  }
}
